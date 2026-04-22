import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    employeeId : {type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, unique: true},
    date: {type: Date, required: true},
    checkIn: {type: Date, default: null},
    checkOut: {type: Date, default: null},
    status: {type: String, enum: ["PRESENT", "ABSENT", "LATE"], default: "PRESENT"},
    workingHours: {type: Number, default: null},
    dayType: {type: String, enum: ["Full Day", "Three Quarter Day", "Half Day", "Short Day", null], default: null}
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

attendanceSchema.index({employeeId: 1, date: 1}, {unique: true})

export const Attendance = mongoose.model('Attendance', attendanceSchema);

