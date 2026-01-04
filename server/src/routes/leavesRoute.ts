import express from 'express'
import { leaveRequest, pendingLeaves } from '../controllers/leavesController.js'
import { protectRoute } from '../middleware/authMiddleware.js'
import { leaveFormValidator } from '../middleware/validationMiddleware.js'

const route = express.Router()


route.get('/', protectRoute, pendingLeaves)
route.post('/', leaveFormValidator, protectRoute, leaveRequest)


export default route