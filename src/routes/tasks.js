const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// ✅ GET: แสดง tasks ของ user โดยเรียงตามวันครบกำหนด
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.user) {
      query.user = req.query.user; // filter ตาม user
    }
    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST: เพิ่ม task ใหม่ (ต้องมี user)
router.post("/", async (req, res) => {
  try {
    if (!req.body.user) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT: อัปเดต task (ตรวจสอบว่าเป็น task ของ user)
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.body.user }, // ตรวจสอบว่า task เป็นของ user นี้
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE: ลบ task (ตรวจสอบว่าเป็นของ user)
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.query.user, // ใช้ query param user
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
