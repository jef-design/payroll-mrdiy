import { body, param } from "express-validator";
const emailVerifyValidator = [
    param("id")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail().withMessage("Use a valid email e.g juan@mrdiy.com"),
];
const registerValidator = [
    body("email").notEmpty().withMessage("Email must be filled").isEmail().withMessage("Use a valid email e.g juan@mrdiy.com"),
];
const signInValidator = [
    body("email").notEmpty().withMessage("Email must be filled").isEmail().withMessage("Use a valid email e.g juan@mrdiy.com"),
    body("password")
        .notEmpty()
        .withMessage("Password must be filled")
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be 6-12 characters"),
];
const leaveFormValidator = [
    body("approver").notEmpty().withMessage("Approver email must be filled").isEmail().withMessage("Use a valid email e.g juan@mrdiy.com"),
    body("reason")
        .notEmpty()
        .withMessage("Provide a reason for leave"),
    body("leaveType")
        .notEmpty()
        .withMessage("Please select leave type")
];
export { registerValidator, signInValidator, emailVerifyValidator, leaveFormValidator };
