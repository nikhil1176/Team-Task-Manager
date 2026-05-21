const express = require('express');
const router = express.Router();
const { createTask, updateTaskStatus, getTasksByProjectId, deleteTask, getRecentActivity } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, createTask);


router.get('/recent', protect, getRecentActivity);

router.get('/project/:projectId', protect, getTasksByProjectId);
router.patch('/:id/status', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);

module.exports = router;