import express from 'express'
import { protect, protectAdmin } from '../middlewares/auth.js'
import { createPayslip, getPayslips, getPayslipsById } from '../controllers/payslipController.js'

const payslipRouter = express.Router()

payslipRouter.post('/', protect, protectAdmin, createPayslip)
payslipRouter.get('/', protect, getPayslips)
payslipRouter.get('/:id', protect, getPayslipsById)

export default payslipRouter