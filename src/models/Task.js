const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },

  // เก็บวันครบกำหนดเท่านั้น
  dueDate: { type: Date } 
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
