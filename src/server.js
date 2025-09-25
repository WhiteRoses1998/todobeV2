require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Routes
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");

app.use("/tasks", tasksRouter);
app.use("/auth", authRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Cloud To-Do API running...");
});

// Connect MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
