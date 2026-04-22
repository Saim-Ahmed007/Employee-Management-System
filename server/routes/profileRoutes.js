import express from 'express'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { protect } from '../middlewares/auth.js'

const profileRouter = express.Router()

profileRouter.get('/', protect, getProfile)
profileRouter.post('/', protect, updateProfile)

export default profileRouter