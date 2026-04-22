import express from 'express'
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/employeeController.js'
import { protect, protectAdmin } from '../middlewares/auth.js'

const employeesRouter = express.Router()

employeesRouter.post("/", protect, protectAdmin, createEmployee)
employeesRouter.get("/", protect, protectAdmin, getEmployees)
employeesRouter.put("/:id", protect, protectAdmin, updateEmployee)
employeesRouter.delete("/:id", protect, protectAdmin, deleteEmployee)

export default employeesRouter