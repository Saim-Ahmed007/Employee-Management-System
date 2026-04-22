import express from 'express'
import { changePassword, login, session } from '../controllers/authController.js'
import { protect } from '../middlewares/auth.js'


const authRouter = express.Router()

authRouter.post("/login", login )
authRouter.get("/session", protect, session)
authRouter.post("/change-password", protect, changePassword)

export default authRouter