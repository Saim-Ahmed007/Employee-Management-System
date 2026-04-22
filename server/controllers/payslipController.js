import { Payslip } from "../models/Payslip.js"
import { Employee } from './../models/Employee.js';

export const createPayslip = async(req, res) => {
    try {
        const {employeeId, month, year, basicSalary, allowances, deductions} = req.body
        if(!employeeId || !month || !year || !basicSalary){
            return res.status(400).json({error: "Missing required fields"})
        }
        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0)
        const payslip = await Payslip.create({
            emoloyeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary
        })
        return res.json({success: true, data: payslip})
    } catch (error) {
        return res.status(500).json({error: "Failed to create payslip"})
    }
}

export const getPayslips = async(req, res) => {
    try {
        const session = req.session
        const isAdmin = session.isAdmin === "ADMIN"
        if(isAdmin){
            const payslips = await Payslip.find().populate("employeeId").sort({createdAt: -1})
            const data = payslips.map((p) => {
                const obj = p.toObject()
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString()
                }
            })
        }else{
            const employee = await Employee.findOne({userId : session.userId})
            if(!employee){
                return res.status(404).json({error: "Employee not found"})
            }
            const payslips = await Payslip.find({employeeId: employee._id}).sort({createdAt: -1})
            return res.json({success: true, data: payslips})
        }
    } catch (error) {
        return res.status(500).json({error: "Failed to fetch payslips"})
    }
}

export const getPayslipsById = async(req,res) => {
    try {
        const payslip = await Payslip.findById(req.params.id).populate("employeeId").lean()
        if(!payslip){
            return res.status(404).json({error: "Not found"})
        }
        const result =  {
            ...payslip,
            id: payslip._id.toString(),
            employeeId: payslip.employeeId
        }
        return res.json(result)

    } catch (error) {
         return res.status(500).json({error: "Failed to retrieve payslip"})
    }
}