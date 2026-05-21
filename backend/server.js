// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials:true
})); 
app.use(express.json()); // Allows the server to accept JSON data in request bodies

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));       
app.use('/api/users', require('./routes/userRoutes'));

// A simple test route
app.get('/', (req, res) => {
  res.send('Ethara Task Manager API is running...');
});

// Define the Port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});