import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Not Authorized, No token' });
    }
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error("SECRET_KEY is not defined in environment variables.");
    }
    jwt.verify(token, secretKey, async function (err, decoded) {
        if (err) {
            return res.status(401).json({ message: 'Token Expired', tokenExpired: err });
        }
        else {
            const { id } = decoded;
            const user = await prisma.employees.findUnique({ where: { employee_id_no: id } });
            req.user = user?.employee_id_no;
            console.log(id);
            next();
        }
    });
};
export { protectRoute };
