# 🚀 WorkSphere - Employee Tracker System

A full-stack **Employee Management & Productivity Tracking System** built using **React, Node.js, Express.js, and MongoDB**.

WorkSphere helps organizations efficiently manage employees, assign tasks, track attendance, monitor productivity, and analyze overall team performance through an interactive dashboard.

---

## 📖 Overview

WorkSphere is designed to simplify workforce management by providing dedicated dashboards for both **Administrators** and **Employees**.

The platform enables:

* Employee management
* Task assignment and tracking
* Attendance monitoring
* Productivity analytics
* Notifications and activity tracking
* Secure role-based authentication

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT Authentication
* Role-Based Access Control (RBAC)
* Secure Login System
* Admin Authentication
* Employee Authentication
* Protected Routes

---

## 👨‍💼 Admin Features

* 📊 Company Dashboard
* 👥 Employee Management
* ➕ Create Employees
* ❌ Delete Employees
* 📋 Assign Tasks
* 🕒 View Attendance Records
* 📈 Monitor Team Productivity
* 📊 Analytics Dashboard
* 🔔 Notification Management
* 📝 Activity Feed

---

## 👨‍💻 Employee Features

* 📊 Personal Dashboard
* 📋 View Assigned Tasks
* ✅ Update Task Status
* 🕒 Mark Attendance
* 🔔 View Notifications
* 📈 Productivity Analytics
* 👤 Profile Management

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Recharts
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)
* Bcrypt.js

---

## 📂 Project Structure

```bash
employee-tracker-system
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── routes
│   │   └── context
│   └── package.json
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   ├── seeder.js
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Abhinavreddy2006/employee-tracker-system.git

cd employee-tracker-system
```

---

### 2️⃣ Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_tracker
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Frontend Setup

Navigate to the client directory:

```bash
cd ../client
npm install
```

---

## 🌱 Database Seeding

To populate the database with sample data:

```bash
cd server
node seeder.js
```

This automatically creates:

|        Data          |                Details                 |
|----------------------|----------------------------------------|
| 👤 Admin User        | 1 admin account                        |
| 👥 Employee Users    | 3 employee accounts                    |
| 📋 Sample Tasks      | 10 tasks with priorities and deadlines |
| 🔔 Notifications     | Pre-loaded notifications               |
| 🗓 Attendance Records | Sample attendance entries              |
| 📰 Activity Logs     | Activity history                       |

To wipe all data and reseed from scratch:

```bash
node seeder.js --wipe
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Start Frontend Application

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔑 Default Login Credentials

| Role     | Email                                               | Password |
| -------- | --------------------------------------------------- | -------- |
| Admin    | [admin@worksphere.com](mailto:admin@worksphere.com) | admin123 |
| Employee | [rahul@worksphere.com](mailto:rahul@worksphere.com) | emp123   |
| Employee | [priya@worksphere.com](mailto:priya@worksphere.com) | emp123   |
| Employee | [arjun@worksphere.com](mailto:arjun@worksphere.com) | emp123   |

---

## 📊 Core Modules

### Employee Management

* Create Employees
* Manage Employee Records
* Delete Employees

### Task Management

* Assign Tasks
* Update Task Status
* Track Progress

### Attendance Management

* Daily Attendance Tracking
* Attendance Reports

### Productivity Analytics

* Employee Performance Metrics
* Team Productivity Analysis
* Dashboard Visualizations

### Notification System

* Task Notifications
* Activity Updates
* User Alerts

---

## 🚀 Future Improvements

* Email Notifications
* Payroll Management
* Leave Management System
* Real-Time Team Chat
* Employee Performance Reviews
* Docker Deployment
* Cloud Hosting Support
* Advanced Reporting & Export Features

---

## 📸 Screenshots

> Add screenshots of:
>
> * Admin Dashboard
> * Employee Dashboard
> * Task Management
> * Attendance Module
> * Analytics Dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is developed for educational and learning purposes.

---

## 👨‍💻 Author

### Abhinav Reddy

GitHub:
https://github.com/Abhinavreddy2006

---

⭐ If you found this project useful, consider giving it a star on GitHub!
