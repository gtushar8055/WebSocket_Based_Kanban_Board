const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Production-safe CORS (important change)
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for demo deployment
    methods: ["GET", "POST"],
  },
});

// Task storage in memory
let tasks = [];
let taskIdCounter = 1;

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
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

// Reset endpoint
app.post("/api/reset", (req, res) => {
  tasks = [];
  taskIdCounter = 1;
  io.emit("sync:tasks", tasks);
  res.json({ message: "Tasks reset" });
});

// WebSocket logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("sync:tasks", tasks);

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
  });

  socket.on("task:update", (updatedTask) => {
    const taskIndex = tasks.findIndex((t) => t.id === updatedTask.id);

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      io.emit("task:updated", tasks[taskIndex]);
    } else {
      socket.emit("error", { message: "Task not found" });
    }
  });

  socket.on("task:move", ({ taskId, newStatus }) => {
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      task.status = newStatus;
      io.emit("task:moved", { taskId, newStatus });
    } else {
      socket.emit("error", { message: "Task not found" });
    }
  });

  socket.on("task:delete", (taskId) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      io.emit("task:deleted", taskId);
    } else {
      socket.emit("error", { message: "Task not found" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
