import express from 'express'
import { addPasswordToNewUser, checkresetPassToken, interceptRefreshToken, logOutUser, requestVerifyEmail, selectUseryEmail, signInEmployee } from '../controllers/employeeController.js'
import { emailVerifyValidator, registerValidator, signInValidator } from '../middleware/validationMiddleware.js'

const route = express.Router()

route.patch('/update/password/:token', addPasswordToNewUser)
route.post('/signin',signInValidator, signInEmployee)
route.post('/email-verification',registerValidator, requestVerifyEmail)
route.get('/logout', logOutUser)
route.get("/refresh", interceptRefreshToken);
route.get("/password/:token", checkresetPassToken);
route.get('/:id', emailVerifyValidator, selectUseryEmail)



export default route