import express from 'express'
import { getDashboard } from '../controllers/dashboardController.js'
import { protect } from './../middlewares/auth.js';

const dashboardRouter = express.Router()

dashboardRouter.get('/',protect, getDashboard)

export default dashboardRouter