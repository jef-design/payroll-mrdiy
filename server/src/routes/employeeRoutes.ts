import express from 'express'
import { findMyEmail } from '../controllers/employeesController'

const router = express.Router()

router.get('/', findMyEmail)

export default router