import { PrismaClient } from '../../prisma/src/generated/prisma';
const prisma = new PrismaClient()


const findMyEmail = async (req: Request, res: Response) => {
    try {
        console.log("test");
        const users = await prisma.employees.findMany();
        console.log("test1");
        res.status(200).json({message: "hello users", users});
    } catch (error) {}
};

export {findMyEmail}