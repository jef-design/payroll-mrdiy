import express from 'express';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes.js';
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT;
const app = express();
// Allow requests from your frontend
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/employee', employeeRoutes);
app.listen(PORT, () => {
    console.log(`running on PORT ${PORT}`);
});
