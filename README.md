# 🚀 Ultimate Team Task Manager

A modern, high-performance task management application designed to streamline team collaboration. Built with a focus on seamless user experience, role-based access control, and a beautifully crafted UI.

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Distinct permissions for `Admin` (can create projects/tasks, delete tasks) and `Member` (can update task status).
* **Interactive Kanban Board:** Premium drag-and-drop style interface with distinct status columns (To Do, In Progress, Done).
* **Modern Dark/Light Mode:** Fully integrated and polished theme toggling for an optimal viewing experience in any lighting.
* **Real-time Dashboard:** Dynamic overview of active projects, assigned tasks, and a recent activity feed.
* **Responsive & Fluid UI:** Crafted with Tailwind CSS and Framer Motion for smooth transitions, micro-interactions, and a glassmorphism feel.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Node.js, Express.js, RESTful APIs
* **Authentication:** JSON Web Tokens (JWT) for secure session management

## ⚙️ Local Setup & Installation

Follow these steps to get the project running on your local machine.

### Prerequisites
* Node.js installed on your machine
* Git

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd <your-project-folder>

### 2. Backend Setup
```bash
cd backend
npm install

Create a .env file in the backend directory and add the following variables:
PORT=5000
JWT_SECRET=your_super_secret_key
# Add your database connection URI here

Start the backend server:
```bash
npm start
#or npm run dev (if using nodemon)

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
cd frontend
npm install

Create a .env file in the frontend directory:
VITE_API_URL=http://localhost:5000

Start the frontend development server:
npm run dev

## 🔒 Default Credentials
- Admin: admin@test.com / password123
- Member: member@test.com / password123

# Crafted with dedication by Nikhil.