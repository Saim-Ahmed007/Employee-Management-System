import express from 'express'
import { protect } from '../middlewares/auth.js'
import { clockInOut, getAttendance } from '../controllers/attendanceController.js'


const attendanceRouter = express.Router()

attendanceRouter.post("/", protect, clockInOut)
attendanceRouter.get("/session", protect, getAttendance)

export default attendanceRouter