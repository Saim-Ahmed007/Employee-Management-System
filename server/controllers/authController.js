import { User } from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async(req,res) => {
    try {
        const {email, password, role_type} = req.body
        if(!email || !password){
            return res.status(400).json({error: "Missing required fields"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({error: "Invalid credentials"})
        }
        if(role_type === 'admin' && user.role !== "ADMIN"){
            return res.status(401).json({error: "Invalid credentials"})
        }
        if(role_type === 'employee' && user.role !== "EMPLOYEE"){
            return res.status(401).json({error: "Invalid credentials"})
        }
        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid){
            return res.status(401).json({error: "Invalid credentials"})
        }
        const payload = {
            userId : user._id.toString(),
            email: user.email,
            role: user.role
        }
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})
        return res.json({user: payload, token})
    } catch (error) {
        res.status(500).json({error: 'Login failed'})   
    }
}

export const session = async(req,res) => {
    const session = req.session
    return res.json({user: session})
}

export const changePassword = async(req,res) => {
    try {
        const session = req.session
        const {newPassword, currentPassword} = req.body
        if(!currentPassword || !newPassword){
            return res.status(400).json({error: "Both passwords are required"})
        }
        const user = await User.findById(session.userId)
        if(!user){
            return res.status(400).json({error: "User not found"})
        }
        const isValid = await bcrypt.compare(currentPassword, user.password)
        if(!isValid){
            return res.status(400).json({error: "Current password is incorrect"})
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ error: "New password must differ from current password" })
        }
        const hashed = await bcryps.hash(newPassword, 10)
        await User.findByIdAndUpdate(session.userId, {password: hashed})
        return res.json({ message: "Password changed successfully" })
    } catch (error) {
        res.status(500).json({error: 'Failed to update password'})  
    }
}