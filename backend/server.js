const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Task storage in memory
let tasks = [];
let taskIdCounter = 1;

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    size: req.file.size,
  });
});

// Reset endpoint for E2E tests
app.post("/api/reset", (req, res) => {
  tasks = [];
  taskIdCounter = 1;
  io.emit("sync:tasks", tasks);
  res.json({ message: "Tasks reset" });
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send all existing tasks to newly connected client
  socket.emit("sync:tasks", tasks);

  // Create new task
  socket.on("task:create", (taskData) => {
    const newTask = {
      id: taskIdCounter++,
      title: taskData.title,
      description: taskData.description || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      category: taskData.category || "feature",
      attachments: taskData.attachments || [],
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    io.emit("task:created", newTask);
    console.log(`Task created: ${newTask.id} - ${newTask.title}`);
  });

  // Update existing task
  socket.on("task:update", (updatedTask) => {
    const taskIndex = tasks.findIndex((t) => t.id === updatedTask.id);

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      io.emit("task:updated", tasks[taskIndex]);
      console.log(`Task updated: ${updatedTask.id}`);
    } else {
      socket.emit("error", { message: "Task not found" });
    }
  });

  // Move task between columns
  socket.on("task:move", ({ taskId, newStatus }) => {
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      task.status = newStatus;
      io.emit("task:moved", { taskId, newStatus });
      console.log(`Task moved: ${taskId} to ${newStatus}`);
    } else {
      socket.emit("error", { message: "Task not found" });
    }
  });

  // Delete task
  socket.on("task:delete", (taskId) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      io.emit("task:deleted", taskId);
      console.log(`Task deleted: ${taskId}`);
    } else {
      socket.emit("error", { message: "Task not found" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Create uploads directory
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
