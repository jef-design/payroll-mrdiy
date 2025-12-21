import {Request, Response} from "express";
import {prisma} from "../lib/prisma.js";
import crypto from "crypto";
import Handlebars from "handlebars";
import {VERIFICATION_EMAIL_TEMPLATE} from "../helper/emailTemplates.js";
import transporter from "../utils/nodemailer.js";
import bcrypt from "bcrypt";

const selectUseryEmail = async (req: Request, res: Response) => {
    const email = req.params.id;
    try {
        const ee = await prisma.employees.findUnique({
            where: {email_address: email},
        });

        if (!ee) {
            // Employee not found
            return res.status(404).json({
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
    console.log(req.body);

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
            from: '"DiyPayroll" linklys.contact@gmail.com',
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
const addPasswordToNewUser = async (req: Request, res: Response) => {
    const {token} = req.params;
    
    const {newPassword} = req.body;
    const password = newPassword;
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPass = await bcrypt.hash(password, salt);

         const user: any = await prisma.verificationToken.findFirst({
            where: {
                type: "password",
                token: token,
            },
        }); 
        
console.log('sad', user)
        if(!token) {
          return res.status(404).json({message: "No token found"})
        }
        await prisma.employees.update({
            where: {
                employee_id_no: user?.employee_id_no,
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
        res.status(200).json({message: "added pass"})
    
    } catch (error) {}
};
export {selectUseryEmail, requestVerifyEmail, addPasswordToNewUser};
