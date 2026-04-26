# Employee Management System

A full-stack web application for managing employees, attendance, leave requests, and payslips.

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- date-fns
- Lucide React
- React Hot Toast

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Multer
- Inngest (background jobs)

---

## Features

- **Authentication** — JWT-based login with role separation (Admin / Employee)
- **Employee Management** — Add, update, soft-delete employees
- **Attendance Tracking** — Log and view attendance records
- **Leave Management** — Employees can apply for leave; admins can approve or reject
- **Payslip Generation** — Admins generate monthly payslips; employees can view and print theirs
- **Change Password** — Users can update their password from settings
- **Print Payslip** — Printable payslip view per employee

---

## Project Structure

```
├── client/                   # React frontend
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── components/       # Reusable UI components
│   │   │   ├── payslip/
│   │   │   └── leave/
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # Route-level pages
│   │   └── main.jsx
│
├── server/                   # Express backend
│   ├── config/               # DB connection
│   ├── controllers/          # Route handlers
│   ├── middlewares/          # Auth middleware (protect, protectAdmin)
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Payslip.js
│   │   └── ...
│   ├── routes/               # Express routers
│   ├── inngest/              # Background job functions
│   └── index.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/employee-ms.git
   cd employee-ms
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/employee-ms
   JWT_SECRET=your_jwt_secret_here
   ```

5. **Run the development servers**

   Start the backend:
   ```bash
   cd server
   npm run dev
   ```

   Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

---

## API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/session` | Get current session | Protected |
| POST | `/api/auth/change-password` | Change password | Protected |
| GET | `/api/employees` | List all employees | Admin |
| POST | `/api/employees` | Add employee | Admin |
| GET | `/api/payslips` | Get payslips | Protected |
| POST | `/api/payslips` | Generate payslip | Admin |
| GET | `/api/payslips/:id` | Get payslip by ID | Protected |
| GET | `/api/leave` | Get leave records | Protected |
| POST | `/api/leave` | Apply for leave | Protected |
| PATCH | `/api/leave/:id` | Update leave status | Admin |
| GET | `/api/attendance` | Get attendance | Protected |
| GET | `/api/dashboard` | Dashboard stats | Protected |

---

## Roles

| Role | Permissions |
|------|-------------|
| `ADMIN` | Full access — manage employees, approve leave, generate payslips |
| `EMPLOYEE` | View own profile, attendance, leave history, and payslips |

---

## License

MIT
