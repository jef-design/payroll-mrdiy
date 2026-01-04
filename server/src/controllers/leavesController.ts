import {Request, Response} from "express";
import {prisma} from "../lib/prisma.js";
import Handlebars from "handlebars";
import {LEAVE_REQUEST_EMAIL_TEMPLATE} from "../helper/emailTemplates.js";
import transporter from "../utils/nodemailer.js";
import {validationResult} from "express-validator";
// LEAVE REQUEST

const leaveRequest = async (req: Request, res: Response) => {
    const {EEID, name, approver, leaveType, reason, from, to, duration} = req.body;
    const userId = req.user;
     const resError = validationResult(req);
    const errors = resError.array().map((err: any) => ({ path: err.path, msg: err.msg }));

    // Get logged-in user's email
    const currentUser = await prisma.employees.findFirst({
        where: { employee_id_no: userId }
    });

    // Custom check: cannot approve self
    if (approver && approver === currentUser?.email_address) {
        errors.push({
            path: "approver",
            msg: "You cannot use your own email for this action. Please use a valid approver email."
        });
    }
    // Validate if authorized approver
    // Step 4: check if approver exists AND is a manager
    if (approver) {
        const approverData: any = await prisma.employees.findFirst({
            where: { email_address: approver }
        });
        // if (!approverData) {
        //     errors.push({
        //         path: "approver",
        //         msg: "Approver email does not exist."
        //     });
        // }
        // if (!approverData || !approverData?.position.toLowerCase().includes("manager")) {
        //     errors.push({
        //         path: "approver",
        //         msg: "The approver must be an authorized manager."
        //     });
        // }
    }

    // If any errors, return all
    if (errors.length > 0) {
        return res.status(400).json({ messageError: errors });
    }
    try {
        const leave = await prisma.leaveRequest.create({
            data: {
                employee_id_no: EEID,
                name: name,
                approver: approver,
                leave_balance: "test",
                leave_type: leaveType,
                reason: reason,
                from: from,
                to: to,
                duration: duration,
                status: "pending",
            },
        });
        const template = Handlebars.compile(LEAVE_REQUEST_EMAIL_TEMPLATE);
        const replacementData = {
            EEID,
            name: name,
            leaveType,
            from: from,
            to: to,
            duration: duration,
            reason: reason,
        };
        const htmlTemplate = template(replacementData);
        await transporter.sendMail({
            from: '"MrD.I.Y Employee Portal" mrdiy.dev@gmail.com',
            to: approver,
            subject: "Leave Request",
            text: "Thank you for using DiyPayroll",
            html: htmlTemplate,
        });
        res.status(200).json({message: "leave request sent", leave});
    } catch (error) {
        console.error("CREATE LEAVE ERROR:", error);
        res.status(500).json({error: "Failed to create leave request"});
    }
};
const pendingLeaves = async (req: Request, res: Response) => {
    console.log("count", req.query);
    const {status} = req.query as any;
    const {id} = req.user as any;
    try {
        const whereClause: any = {
            employee_id_no: id,
        };

        if (status && status !== "all") {
            whereClause.status = status;
        }

        const leave = await prisma.leaveRequest.findMany({
            where: whereClause,
        });
        res.status(200).json({message: "pending leave count", leave});
    } catch (error) {}
};
const approvedLeaves = async (req: Request, res: Response) => {
    const {id} = req.user as any;
    try {
        const leave = await prisma.leaveRequest.count({
            where: {
                status: "approved",
                employee_id_no: id,
            },
        });
        res.status(200).json({message: "approved leave count", leave});
    } catch (error) {}
};
export {leaveRequest, pendingLeaves, approvedLeaves};
