import express from 'express';
import { addPasswordToNewUser, requestVerifyEmail, selectUseryEmail } from '../controllers/employeeController.js';
const route = express.Router();
route.get('/:id', selectUseryEmail);
route.patch('/update/password/:token', addPasswordToNewUser);
route.post('/email-verification', requestVerifyEmail);
export default route;
