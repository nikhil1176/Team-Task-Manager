# **🚀 Ultimate Team Task Manager**

A modern, high-performance task management application designed to streamline team collaboration. Built with a focus on seamless user experience, role-based access control, and a beautifully crafted UI.

---


## ✨ Key Features

* **Role-Based Access Control (RBAC):** Distinct permissions for `Admin` (can create projects/tasks, delete tasks) and `Member` (can update task status).
* **Interactive Kanban Board:** Premium drag-and-drop style interface with distinct status columns (To Do, In Progress, Done).
* **Modern Dark/Light Mode:** Fully integrated and polished theme toggling for an optimal viewing experience in any lighting.
* **Real-time Dashboard:** Dynamic overview of active projects, assigned tasks, and a recent activity feed.
* **Responsive & Fluid UI:** Crafted with Tailwind CSS and Framer Motion for smooth transitions, micro-interactions, and a glassmorphism feel.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Node.js, Express.js, RESTful APIs
* **Authentication:** JSON Web Tokens (JWT) for secure session management

---

## ⚙️ Local Setup & Installation

Follow these steps to get the project running on your local machine.

### Prerequisites
* Node.js installed on your machine
* Git

### **Local Setup**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/nikhil1176/Online-Forum.git
   cd Online-Forum
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

### **Environment Variables**

Create a `.env` file in the backend directory with the following:

```
PORT=5000
DATABASE_URL=Your MongoDB connection string
JWT_SECRET=Your private key for authentication
```

---

## **🔒 Default Credentials**
- **Admin:** admin@test.com / password123
- **Member:** member@test.com / password123

---

**Crafted with dedication by Nikhil.**