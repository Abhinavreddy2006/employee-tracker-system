/**
 * DATABASE SEEDER
 * Run once to set up admin + sample data so the app works immediately.
 *
 *   node seeder.js          → seed (skips if admin already exists)
 *   node seeder.js --wipe   → wipe ALL data, then seed fresh
 */
import mongoose from "mongoose";
import bcrypt   from "bcryptjs";
import dotenv   from "dotenv";
dotenv.config();

import User         from "./models/userModel.js";
import Task         from "./models/taskModel.js";
import Attendance   from "./models/attendanceModel.js";
import Notification from "./models/notificationModel.js";
import Activity     from "./models/activityModel.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB\n");

// ── Wipe first if requested ───────────────────────────────────────────────────
if (process.argv[2] === "--wipe") {
    await Promise.all([
        User.deleteMany(),
        Task.deleteMany(),
        Attendance.deleteMany(),
        Notification.deleteMany(),
        Activity.deleteMany(),
    ]);
    console.log("🗑️  All data wiped.\n");
}

// ── Skip if admin already exists (prevent duplicates) ─────────────────────────
const existing = await User.findOne({ role: "admin" });
if (existing) {
    console.log("⚠️  Admin already exists — seeder skipped.");
    console.log("   Run:  node seeder.js --wipe   to reseed fresh.\n");
    process.exit();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const hash   = (pw)   => bcrypt.hash(pw, 10);
const future = (days) => new Date(Date.now() + days * 86_400_000);
const past   = (days) => new Date(Date.now() - days * 86_400_000);

// ── 1. Admin ──────────────────────────────────────────────────────────────────
await User.create({
    name:     "Admin",
    email:    "admin@worksphere.com",
    password: await hash("admin123"),
    role:     "admin",
    position: "System Administrator",
});
console.log("👑 Admin created");

// ── 2. Employees ──────────────────────────────────────────────────────────────
const [emp1, emp2, emp3] = await Promise.all([
    User.create({ name: "Rahul Sharma", email: "rahul@worksphere.com", password: await hash("emp123"), role: "employee", position: "Frontend Developer" }),
    User.create({ name: "Priya Nair",   email: "priya@worksphere.com", password: await hash("emp123"), role: "employee", position: "UI/UX Designer"      }),
    User.create({ name: "Arjun Mehta",  email: "arjun@worksphere.com", password: await hash("emp123"), role: "employee", position: "Backend Developer"   }),
]);
console.log("👤 3 employees created");

// ── 3. Tasks ──────────────────────────────────────────────────────────────────
const taskRows = [
    { title: "Design new landing page",     description: "Create wireframes and high-fidelity mockups for the homepage redesign.", assignedTo: emp2._id, priority: "High",   deadline: future(3),  status: "In Progress" },
    { title: "Fix authentication bug",      description: "Users are being logged out unexpectedly. Investigate JWT expiry.",        assignedTo: emp3._id, priority: "High",   deadline: future(2),  status: "Pending"     },
    { title: "Build employee dashboard UI", description: "Implement the dashboard using React and Tailwind CSS.",                   assignedTo: emp1._id, priority: "Medium", deadline: future(7),  status: "In Progress" },
    { title: "Write API documentation",     description: "Document all REST endpoints in a clear README or Swagger file.",          assignedTo: emp3._id, priority: "Low",    deadline: future(10), status: "Pending"     },
    { title: "Optimise database queries",   description: "Profile slow MongoDB queries and add indexes where needed.",              assignedTo: emp3._id, priority: "Medium", deadline: future(5),  status: "Pending"     },
    { title: "Setup CI/CD pipeline",        description: "Configure GitHub Actions for automated testing and deployment.",          assignedTo: emp1._id, priority: "Medium", deadline: past(2),    status: "Pending"     },
    { title: "User acceptance testing",     description: "Run full UAT with the QA team and log issues.",                          assignedTo: emp2._id, priority: "High",   deadline: past(1),    status: "Pending"     },
    { title: "Implement dark mode",         description: "Add a dark mode toggle to the settings page.",                           assignedTo: emp1._id, priority: "Low",    deadline: future(14), status: "Completed"   },
    { title: "Create onboarding flow",      description: "Design and develop a 3-step onboarding wizard for new users.",           assignedTo: emp2._id, priority: "Medium", deadline: future(6),  status: "Completed"   },
    { title: "Database backup automation",  description: "Schedule nightly MongoDB backups to cloud storage.",                     assignedTo: emp3._id, priority: "High",   deadline: future(4),  status: "Completed"   },
];
const tasks = await Task.insertMany(taskRows);
console.log(`📋 ${tasks.length} tasks created`);

// ── 4. Notifications (one per task assignment) ────────────────────────────────
await Notification.insertMany(
    tasks.map(t => ({
        user:    t.assignedTo,
        message: `📋 New task assigned to you: "${t.title}"`,
        read:    false,
    }))
);
console.log("🔔 Notifications created");

// ── 5. Activity log ───────────────────────────────────────────────────────────
await Activity.insertMany([
    { message: "Admin created the project workspace"                            },
    { message: `Task "Design new landing page" assigned to ${emp2.name}`        },
    { message: `Task "Fix authentication bug" assigned to ${emp3.name}`         },
    { message: `Task "Build employee dashboard UI" assigned to ${emp1.name}`    },
    { message: `${emp1.name} completed "Implement dark mode"`                   },
    { message: `${emp2.name} completed "Create onboarding flow"`               },
    { message: `${emp3.name} completed "Database backup automation"`           },
]);
console.log("📜 Activity log created");

// ── 6. Attendance (past 7 days, ~85% rate) ────────────────────────────────────
const attRows = [];
for (let d = 7; d >= 1; d--) {
    const date = past(d).toISOString().split("T")[0];
    for (const emp of [emp1, emp2, emp3]) {
        if (Math.random() > 0.15) attRows.push({ employee: emp._id, date });
    }
}
await Attendance.insertMany(attRows);
console.log(`📅 ${attRows.length} attendance records created`);

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀  Seeding complete!  Login credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Admin     →  admin@worksphere.com  /  admin123
  Employee  →  rahul@worksphere.com  /  emp123
              priya@worksphere.com  /  emp123
              arjun@worksphere.com  /  emp123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

process.exit();
