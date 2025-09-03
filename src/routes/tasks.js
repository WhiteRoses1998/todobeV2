const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET: แสดง tasks ทั้งหมด โดยเรียงตามวันครบกำหนด (ใกล้ที่สุดก่อน)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: เพิ่ม task ใหม่
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// PUT: อัปเดต task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: ลบ task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
