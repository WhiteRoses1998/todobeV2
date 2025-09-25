const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/Task");

// GET: แสดง tasks ของ user โดยเรียงตาม dueDate, createdAt
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.user) {
      if (!mongoose.Types.ObjectId.isValid(req.query.user)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      query.user = req.query.user;
    }
    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: เพิ่ม task ใหม่ (ต้องมี user)
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, user } = req.body;

    if (!title || !user) {
      return res.status(400).json({ message: "Title and User ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const task = new Task({ title, description, dueDate, user });
    await task.save();

    res.status(201).json(task); // ✅ ส่ง task กลับตรง ๆ
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT: อัปเดต task (ตรวจสอบ user)
router.put("/:id", async (req, res) => {
  try {
    const { user, title, description, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user },
      { title, description, dueDate },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found or not authorized" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: ลบ task (ตรวจสอบ user)
router.delete("/:id", async (req, res) => {
  try {
    const { user } = req.query;

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user });

    if (!task) return res.status(404).json({ message: "Task not found or not authorized" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
