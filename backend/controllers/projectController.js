const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a new project (Admin Only)
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user._id // 'protect' middleware se user ID mil jayegi
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects (Accessible to logged-in users)
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    // .populate() se hume user ki ID ki jagah uska naam aur email milega
    const projects = await Project.find().populate('createdBy', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Dashboard Stats
// @route   GET /api/projects/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const projectCount = await Project.countDocuments();
    const taskCount = await Task.countDocuments();
    const userCount = await User.countDocuments();
    
    // Sirf 'TODO' ya 'IN_PROGRESS' tasks ko assigned maante hain
    const activeTasks = await Task.countDocuments({ status: { $ne: 'DONE' } });

    res.status(200).json({
      totalProjects: projectCount,
      totalTasks: taskCount,
      activeTasks: activeTasks,
      totalUsers: userCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project details', error: error.message });
  }
};