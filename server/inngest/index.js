import { Inngest } from "inngest";
import { Attendance } from "../models/Attendance.js";
import { Employee } from "../models/Employee.js";
import { LeaveApplication } from "../models/LeaveApplication.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "fullstack-ems" });

// auto check-out for employees
const autoCheckOut = inngest.createFunction(
  { id: "auto-check-out", triggers: [{ event: "employee/check-in" }] },
  async ({ event, step }) => {
    const { employeeId, attendanceId, checkInTime } = event.data;
    const checkInMs = new Date(checkInTime).getTime();

    await step.sleepUntil(
      "wait-for-9-hours",
      new Date(checkInMs + 9 * 60 * 60 * 1000)
    );

    const attendance = await step.run("get-attendance", () =>
      Attendance.findById(attendanceId).lean()
    );

    if (!attendance?.checkOut) {
      const employee = await step.run("get-employee", () =>
        Employee.findById(employeeId).lean() // ✅ .lean() for safe serialization
      );

      // ✅ Wrapped in step.run
      await step.run("send-reminder-email", async () => {
        await sendEmail({
          to: employee.email,
          subject: "Attendance check-out reminder",
          body: `<div style="max-width: 600px;">
            <h2>Hi ${employee.firstName}, 👋</h2>
            <p style="font-size: 16px;">You have been checked in since:</p>
            <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
              ${new Date(attendance.checkIn).toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka' })}
            </p>
            <p style="font-size: 16px;">Please make sure to check out within one hour.</p>
            <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
            <br />
            <p style="font-size: 16px;">Best Regards,<br/><strong>EMS</strong></p>
          </div>`
        })
      })

      await step.sleepUntil(
        "wait-for-10-hours",
        new Date(checkInMs + 10 * 60 * 60 * 1000)
      );

      // ✅ Re-fetch to check latest status
      const finalAttendance = await step.run("get-attendance-final", () =>
        Attendance.findById(attendanceId).lean()
      );

      if (!finalAttendance?.checkOut) {
        // ✅ Re-fetch live Mongoose doc inside step for .save()
        await step.run("auto-checkout", async () => {
          const doc = await Attendance.findById(attendanceId)
          if (doc && !doc.checkOut) {
            doc.checkOut = new Date(checkInMs + 10 * 60 * 60 * 1000)
            doc.workingHours = 10
            doc.dayType = "Half Day"
            doc.status = "LATE"
            await doc.save()
          }
        })
      }
    }
  }
);

//send email to admin if admin doesnot take action on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder", triggers: [{ event: "leave/pending" }] },
  async ({ event, step }) => {
    const { leaveApplicationId, submittedAt } = event.data; // ✅ correct variables
    const submittedMs = new Date(submittedAt).getTime();

    // Wait 24 hours from submission
    await step.sleepUntil(
      "wait-for-24-hours",
      new Date(submittedMs + 24 * 60 * 60 * 1000)
    );

    // ✅ DB call wrapped in step.run
    const leaveApplication = await step.run("get-leave-application", () =>
      LeaveApplication.findById(leaveApplicationId).lean()
    );

    if (leaveApplication?.status === "PENDING") {
      // ✅ Correct model
      const employee = await step.run("get-employee", () =>
        Employee.findById(leaveApplication.employeeId.toString()).lean()
      );

      await step.run("send-admin-reminder", async () => {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "Leave Application Reminder",
          body: `<div style="max-width: 600px;">
            <h2>Hi Admin, 👋</h2>
            <p style="font-size: 16px;">A leave application from <strong>${employee.firstName} ${employee.lastName}</strong> (${employee.department}) is still pending after 24 hours.</p>
            <p style="font-size: 16px;">Leave Period: <strong>${new Date(leaveApplication.startDate).toLocaleDateString()}</strong> → <strong>${new Date(leaveApplication.endDate).toLocaleDateString()}</strong></p>
            <p style="font-size: 16px;">Reason: ${leaveApplication.reason}</p>
            <p style="font-size: 16px;">Please log in and take action on this application.</p>
            <br />
            <p style="font-size: 16px;">Best Regards,<br/><strong>EMS</strong></p>
          </div>`
        });
      });
    }
  }
);

//cron: check attendance at 11.30 AM and email absesnt employees 
const attendanceReminderCron = inngest.createFunction(
    { id: "attendance-reminder-cron", triggers: [{ cron: "0 6 * * *" }] },
     //06:00 UTC = 12:00 PM Dhaka (BST UTC+6)
    async ({ step }) => {

        // Step 1: Get today's date range in Dhaka time
        const today = await step.run('get-today-date', () => {
            const startUTC = new Date(
                new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' })
                + 'T00:00:00+06:00' // ✅ Correct Dhaka offset
            )
            const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000)
            return {
                startUTC: startUTC.toISOString(),
                endUTC: endUTC.toISOString()
            }
        }) 

        // Step 2: Get all active employees
        const activeEmployees = await step.run('get-active-employees', async () => {
            const employees = await Employee.find({
                isDeleted: false,
                employmentStatus: "ACTIVE"
            }).lean()
            return employees.map((e) => ({
                _id: e._id?.toString(),
                firstName: e.firstName,
                lastName: e.lastName,
                email: e.email,
                department: e.department
            }))
        })

        // Step 3: Get employee IDs on approved leave today
        const onLeaveIds = await step.run('get-leave-ids', async () => {
            const leaves = await LeaveApplication.find({
                status: "APPROVED",
                startDate: { $lte: new Date(today.endUTC) },
                endDate: { $gte: new Date(today.startUTC) }
            }).lean()
            return leaves.map((l) => l.employeeId.toString())
        })

        // Step 4: Get employee IDs who already checked in today
        const checkedInIds = await step.run('get-checked-in-ids', async () => {
            const attendances = await Attendance.find({
                date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC) }
            }).lean()
            return attendances.map((a) => a.employeeId.toString())
        })

        // Step 5: Filter absent employees
        const absentEmployees = activeEmployees.filter((emp) =>
            !onLeaveIds.includes(emp._id) && !checkedInIds.includes(emp._id)
        )

        // Step 6: Send reminder emails
        if (absentEmployees.length > 0) {
            await step.run('send-reminder-emails', async () => {
                const emailPromises = absentEmployees.map((emp) =>{
                    return sendEmail({
                        to: emp.email,
                        subject: "Attendance Reminder - please mark your attendance",
                        body: `<div style="max-width: 600px; font-family: Arial, sans-serif;">
                                <h2>Hi ${emp.firstName}, 👋</h2>
                                <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                                <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
                                <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                                <br />
                                <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
                                <br />
                                <p style="font-size: 16px;">Best Regards,</p>
                                <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                            </div>`
                    })
                }) 
                await Promise.all(emailPromises)
            })
        }

        // Single return at the end
        return {
            totalActive: activeEmployees.length,
            onLeave: onLeaveIds.length,
            checkedIn: checkedInIds.length,
            absent: absentEmployees.length
        }
    }
)
export const functions = [autoCheckOut, leaveApplicationReminder, attendanceReminderCron];