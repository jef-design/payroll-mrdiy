import { prisma } from "../lib/prisma.js";
import crypto from "crypto";
import Handlebars from "handlebars";
import { LEAVE_REQUEST_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "../helper/emailTemplates.js";
import transporter from "../utils/nodemailer.js";
import bcrypt from "bcrypt";
const selectUseryEmail = async (req, res) => {
    const email = req.params.id;
    try {
        const ee = await prisma.employees.findFirst({
            where: { email_address: email },
        });
        if (!ee) {
            // Employee not found
            return res.status(404).json({
                message: `Employee email not found: Please contact your HR or onboarding team to verify your account.`,
            });
        }
        // Employee found
        res.status(200).json({ emp_info: ee, message: "success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//sending request to verify user by email
const requestVerifyEmail = async (req, res) => {
    const usertoVerify = req.body.email;
    console.log(req.body);
    try {
        const findAccount = await prisma.employees.findFirst({
            where: {
                email_address: usertoVerify,
            },
        });
        if (!findAccount) {
            return res.status(404).json({ message: "User not found" });
        }
        const userEmail = findAccount?.email_address;
        // Generate a random verification token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const verifyUrl = process.env.NODE_ENV === "production"
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
            from: '"DiyPayroll" mrdiy.dev@gmail.com',
            to: `${"bermejojff97@gmail.com"}`,
            subject: "Please verify your account",
            text: "Thank you for using DiyPayroll",
            html: htmlTemplate,
        });
        res.status(200).json({ message: "Email sent", email: userEmail });
        console.log("sucesssss");
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
//sign in employee
//leave credits func calculation
function calculateLeaveCredits(joinDate, asOfDate = new Date()) {
    const RATE = 1.25;
    const YEAR_CAP = 15;
    const join = new Date(joinDate);
    const current = new Date(asOfDate);
    if (join > current)
        return 0;
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
const signInEmployee = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        const userExist = await prisma.employees.findFirst({
            where: {
                email_address: email,
            },
        });
        if (!userExist) {
            return res.status(400).json({ message: "Email not found, Please register first" });
        }
        const matched = await bcrypt.compare(password, userExist?.password);
        const leaveCredits = calculateLeaveCredits(userExist.join_date);
        console.log("leave credits", leaveCredits, userExist.join_date);
        if (matched) {
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
        }
        else {
            res.status(400).json({ message: "Invalid Email or Password" });
        }
    }
    catch (error) {
        res.status(400).json({ message: "user not signin", error });
    }
};
const addPasswordToNewUser = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const password = newPassword;
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPass = await bcrypt.hash(password, salt);
        const userTokenInfo = await prisma.verificationToken.findFirst({
            where: {
                type: "password",
                token: token,
            },
        });
        console.log("sad", userTokenInfo);
        if (!token) {
            return res.status(404).json({ message: "No token found" });
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
        const leaveCredits = calculateLeaveCredits(user?.join_date ?? '');
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
    }
    catch (error) { }
};
// LEAVE REQUEST
const leaveRequest = async (req, res) => {
    const { name, approver, leaveType, reason, from, to, duration } = req.body;
    console.log(req.body);
    try {
        const leave = await prisma.leaveRequest.create({
            data: {
                name: name,
                approver: approver,
                leave_balance: "test",
                leave_type: leaveType,
                reason: reason,
                from: from,
                to: to,
                duration: duration,
                status: 'pending'
            },
        });
        console.log(leave, "saltRounds");
        const template = Handlebars.compile(LEAVE_REQUEST_EMAIL_TEMPLATE);
        const replacementData = {
            name: name,
            leaveType,
            from: from,
            to: to,
            duration: duration,
            reason: reason,
        };
        const htmlTemplate = template(replacementData);
        await transporter.sendMail({
            from: '"MrD.I.Y Payroll" mrdiy.dev@gmail.com',
            to: approver,
            subject: "Leave Request",
            text: "Thank you for using DiyPayroll",
            html: htmlTemplate,
        });
        res.status(200).json({ message: "leave request sent", leave });
    }
    catch (error) {
        console.error("CREATE LEAVE ERROR:", error);
        res.status(500).json({ error: "Failed to create leave request" });
    }
};
const pendingLeaves = async (req, res) => {
    console.log('count');
    try {
        const leave = await prisma.leaveRequest.count({
            where: {
                status: 'pending',
            }
        });
        res.status(200).json({ message: 'pending leave count', leave });
    }
    catch (error) {
    }
};
const approvedLeaves = async (req, res) => {
    try {
        const leave = await prisma.leaveRequest.count({
            where: {
                status: 'approved'
            }
        });
        res.status(200).json({ message: 'approved leave count', leave });
    }
    catch (error) {
    }
};
export { selectUseryEmail, requestVerifyEmail, signInEmployee, addPasswordToNewUser, leaveRequest, pendingLeaves, approvedLeaves };
