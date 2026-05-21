const express = require('express');
const router = express.Router();

const { createProject, getProjects, getProjectById, getDashboardStats } = require('../controllers/projectController'); 
const { protect } = require('../middleware/authMiddleware'); 

router.post('/', protect, createProject);
router.get('/', protect, getProjects);

// STATS ROUTE MUST BE BEFORE /:id ROUTE
router.get('/stats', protect, getDashboardStats);

router.get('/:id', protect, getProjectById); 

module.exports = router;