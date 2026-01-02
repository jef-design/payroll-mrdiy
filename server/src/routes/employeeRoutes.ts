import express from 'express'
import { addPasswordToNewUser, leaveRequest, pendingLeaves, requestVerifyEmail, selectUseryEmail, signInEmployee } from '../controllers/employeeController.js'

const route = express.Router()

route.get('/:id', selectUseryEmail)
route.get('/leave', pendingLeaves)
route.patch('/update/password/:token', addPasswordToNewUser)
route.post('/signin', signInEmployee)
route.post('/email-verification', requestVerifyEmail)
route.post('/leave', leaveRequest)



export default route