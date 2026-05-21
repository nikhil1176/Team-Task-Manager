const Task = require('../models/Task');

// @desc    Create a task (Admin Only)
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true } 
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
exports.getTasksByProjectId = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignedTo', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// --- NAYA FUNCTION: RECENT ACTIVITY KE LIYE ---
// @desc    Get recent 5 tasks across all projects
// @route   GET /api/tasks/recent
exports.getRecentActivity = async (req, res) => {
  try {
    const tasks = await Task.find()
      .sort({ createdAt: -1 }) // Sabse naye tasks pehle
      .limit(5) // Sirf top 5
      .populate('projectId', 'title') // Project ka naam
      .populate('assignedTo', 'name'); // User ka naam
      
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activity', error: error.message });
  }
};