import {Request, Response} from "express";
import {prisma} from "../lib/prisma.js";
import crypto from "crypto";
import Handlebars from "handlebars";
import {LEAVE_REQUEST_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "../helper/emailTemplates.js";
import transporter from "../utils/nodemailer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";

//token generation
const generateToken = (res: Response, id: string) => {
    const secretKey: string | undefined = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error("SECRET_KEY is not defined in environment variables.");
    }
    const Token = jwt.sign({id}, secretKey, {
        expiresIn: "15m",
    });
    // if secure true and samesite is none: this not work in postman
    // if secure true/false and samesite is strict: this work both in postman and local
    res.cookie("jwt", Token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 15,
    });

    const refreshToken = jwt.sign({id}, secretKey, {
        expiresIn: "7d",
    });
    res.cookie("jwtRefresh", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60 * 24 * 3,
        //maxAge: 1000 * 20,
    });
    return Token;
};
const interceptRefreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.jwtRefresh;

    if (!refreshToken) {
        return res.status(403).json({message: "No refresh token provided"});
    }
    const secretKey: string | undefined = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error("SECRET_KEY is not defined in environment variables.");
    }
    jwt.verify(refreshToken, secretKey, (err: any, decoded: any) => {
        if (err) return res.status(403).json({message: "Invalid refresh token"});
        const {id} = decoded;
        const newToken = jwt.sign({id}, secretKey, {
            expiresIn: "15m",
        });
        res.cookie("jwt", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 15,
            //maxAge: 1000 * 15
        });
        res.status(200).json({message: "Access token refreshed"});
    });
};
const selectUseryEmail = async (req: Request, res: Response) => {
    const email = req.params.id;
     const resError = validationResult(req);

if (!resError.isEmpty()) {
    return res.status(400).json({
        messageError: resError.array().map(err => ({
            path: "email",
            msg: err.msg
        }))
    });
}
    try {
        
        const ee = await prisma.employees.findFirst({
            where: {email_address: email},
        });
       
        if (!ee) {
            // Employee not found
            return res.status(400).json({
                message: `Employee email not found: Please contact your HR or onboarding team to verify your account.`,
            });
        }

        // Employee found
        res.status(200).json({emp_info: ee, message: "success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

//sending request to verify user by email
const requestVerifyEmail = async (req: Request, res: Response) => {
    const usertoVerify = req.body.email;
    const resError = validationResult(req);

    if (!resError.isEmpty()) {
        return res.status(400).json({messageError: resError.array()});
    }
    try {
        const findAccount = await prisma.employees.findFirst({
            where: {
                email_address: usertoVerify,
            },
        });
        if (!findAccount) {
            return res.status(404).json({message: "User not found"});
        }
        const userEmail = findAccount?.email_address as string;

        // Generate a random verification token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const verifyUrl: string =
            process.env.NODE_ENV === "production"
                ? process.env.BASE_URL_PROD + `/password-update?access=${resetToken}`
                : process.env.BASE_URL_DEV + `/password-update?access=${resetToken}`;

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        await prisma.verificationToken.create({
            data: {
                type: "password",
                token: resetToken,
                employee_id_no: findAccount?.employee_id_no,
                expiresAt,
            },
        });
        // const source = fs.readFileSync(RESET_PASSWORD_TEMPLATE, "utf-8").toString();
        const template = Handlebars.compile(VERIFICATION_EMAIL_TEMPLATE);
        const replacementData = {
            email: userEmail,
            link: verifyUrl,
        };
        const htmlTemplate = template(replacementData);
        await transporter.sendMail({
            // from: '"DiyPayroll" mariel.gonzales@mrdiy.com',
            from: '"MrD.I.Y Employee Portal" mrdiy.dev@gmail.com',
            to: `${"bermejojff97@gmail.com"}`,
            subject: "Please verify your account",
            text: "Thank you for using DiyPayroll",
            html: htmlTemplate,
        });
        res.status(200).json({message: "Email sent", email: userEmail});
        console.log("sucesssss");
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};
//sign in employee

//leave credits func calculation
function calculateLeaveCredits(joinDate: string | Date, asOfDate = new Date()) {
    const RATE = 1.25;
    const YEAR_CAP = 15;

    const join = new Date(joinDate);
    const current = new Date(asOfDate);

    if (join > current) return 0;

    let totalCredits = 0;

    for (let year = join.getFullYear(); year <= current.getFullYear(); year++) {
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);

        const effectiveStart = join > yearStart ? join : yearStart;
        const effectiveEnd = current < yearEnd ? current : yearEnd;

        let months = 0;
        const temp = new Date(effectiveStart);
        temp.setDate(1);

        while (temp <= effectiveEnd) {
            const monthEnd = new Date(temp.getFullYear(), temp.getMonth() + 1, 0);

            if (monthEnd <= effectiveEnd) {
                months++;
            }

            temp.setMonth(temp.getMonth() + 1);
        }

        const yearlyCredits = Math.min(months * RATE, YEAR_CAP);
        totalCredits += yearlyCredits;
    }

    return totalCredits;
}

const signInEmployee = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const resError = validationResult(req);
    console.log(resError.array());
    if (!resError.isEmpty()) {
        return res.status(400).json({messageError: resError.array()});
    }
    try {
        const userExist: any = await prisma.employees.findFirst({
            where: {
                email_address: email,
            },
        });

        if (!userExist) {
            return res.status(400).json({message: "Account not found, Please register first"});
        }

        const matched = await bcrypt.compare(password, userExist?.password);

        const leaveCredits = calculateLeaveCredits(userExist.join_date);

        if (matched) {
            generateToken(res, userExist.employee_id_no);
            res.status(200).json({
                message: "User successfully signin",
                user: {
                    EEID: userExist.employee_id_no,
                    email: userExist.email_address,
                    name: userExist.first_name + " " + userExist.last_name,
                    leaveCredits,
                    department: userExist.division,
                    position: userExist.position,
                    join_date: userExist.join_date,
                },
            });
        } else {
            res.status(400).json({message: "Invalid Email or Password or Try to register your email first"});
        }
    } catch (error) {
        res.status(400).json({message: "user not signin", error});
    }
};
//check password token
const checkresetPassToken = async (req: Request, res: Response) => {
    console.log("check token", req.params);
    const resetToken = req.params.token;
    try {
        const token = await prisma.verificationToken.findFirst({
            where: {
                token: resetToken,
                type: "password",
            },
        });

        if (!token) {
            return res.status(400).json({message: "Invalid or expired token"});
        }
        res.status(200).json({message: "Valid token"});
    } catch (error) {}
};
const addPasswordToNewUser = async (req: Request, res: Response) => {
    const {token} = req.params;

    const {newPassword} = req.body;
    const password = newPassword;
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPass = await bcrypt.hash(password, salt);

        const userTokenInfo: any = await prisma.verificationToken.findFirst({
            where: {
                type: "password",
                token: token,
            },
        });

        if (!token) {
            return res.status(404).json({message: "No token found"});
        }
        const user = await prisma.employees.update({
            where: {
                employee_id_no: userTokenInfo?.employee_id_no,
            },
            data: {
                password: hashedPass,
            },
        });
        await prisma.verificationToken.delete({
            where: {
                token: token,
                type: "password",
            },
        });
        const leaveCredits = calculateLeaveCredits(user?.join_date ?? "");
        res.status(200).json({
            message: "Password added to user",
            user: {
                EEID: userTokenInfo.employee_id_no,
                email: user.email_address,
                name: user.first_name + " " + user.last_name,
                leaveCredits,
                department: user.division,
                position: user.position,
                join_date: user.join_date,
            },
        });
    } catch (error) {}
};
const logOutUser = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(1),
        });
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {}
};
export {selectUseryEmail, requestVerifyEmail, signInEmployee,checkresetPassToken, addPasswordToNewUser, logOutUser, interceptRefreshToken};
