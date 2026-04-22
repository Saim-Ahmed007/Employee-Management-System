import { Employee } from "../models/Employee.js";
import bcrypt from 'bcrypt'
import { User } from "../models/User.js";
import mongoose from "mongoose";

export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;

    const where = {};
    if (department) where.department = department;

    const employees = await Employee.find(where)
      .sort({ createdAt: -1 })
      .populate('userId', 'email role')
      .lean();

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId?.email ? { email: emp.userId.email, role: emp.userId.role } : null,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch employees" });
  }
};

export const createEmployee = async (req, res) => {
  const { firstName, lastName, email, phone, position, department, 
          basicSalary, allowances, deductions, joinDate, password, role, bio } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!joinDate || isNaN(new Date(joinDate))) {
    return res.status(400).json({ error: "Invalid or missing joinDate" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [user] = await User.create(
      [{ email, password: hashed, role: role || "EMPLOYEE" }],
      { session }
    );

    const [employee] = await Employee.create(
      [{
        userId: user._id,
        firstName,
        lastName,
        email,
        phone,
        position,
        department: department || "Engineering",
        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        joinDate: new Date(joinDate),
        bio: bio || ""
      }],
      { session }
    );

    await session.commitTransaction();
    return res.status(201).json({ success: true, employee });

  } catch (error) {
    await session.abortTransaction();
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Create employee error", error);
    return res.status(500).json({ error: "Failed to create employee" });

  } finally {
    session.endSession();
  }
};

export const updateEmployee = async(req,res) => {
  try {
    const {id} = req.params
    const { firstName, lastName, email, phone, position, department, 
          basicSalary, allowances, deductions, password,
          employmentStatus, role, bio } = req.body;
    
    const employee = await Employee.findById(id)
    if(!employee) return res.status(404).json({error: "Employee not found"})

    await Employee.findByIdAndUpdate(id,
      {
        firstName,
        lastName,
        email,
        phone,
        position,
        department: department || "Engineering",
        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        employmentStatus: employmentStatus || "ACTIVE",
        bio: bio || ""
      },
    );

    const userUpdate = {email}
    if(role) userUpdate.role = role
    if(password) userUpdate.password = await bcrypt.hash(password , 10)
    await User.findByIdAndUpdate(employee.userId, userUpdate) 

    return res.status(201).json({ success: true });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Failed to update employee" });
  }
}

export const deleteEmployee = async(req,res) => {
  try {
    const {id} = req.params
    const employee = await Employee.findById(id)
    if(!employee) return res.status(404).json({error: "Employee not found"})
    employee.isDeleted = true
    employee.employmentStatus = "INACTIVE"
    await employee.save()
    await res.json({success: true})
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete employee" });
  }
}