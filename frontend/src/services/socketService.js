import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    // Clean up any old disconnected socket
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL);

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Task operations
  createTask(taskData) {
    this.socket?.emit("task:create", taskData);
  }

  updateTask(taskData) {
    this.socket?.emit("task:update", taskData);
  }

  moveTask(taskId, newStatus) {
    this.socket?.emit("task:move", { taskId, newStatus });
  }

  deleteTask(taskId) {
    this.socket?.emit("task:delete", taskId);
  }

  // Event listeners
  onSyncTasks(callback) {
    this.socket?.on("sync:tasks", callback);
  }

  onTaskCreated(callback) {
    this.socket?.on("task:created", callback);
  }

  onTaskUpdated(callback) {
    this.socket?.on("task:updated", callback);
  }

  onTaskMoved(callback) {
    this.socket?.on("task:moved", callback);
  }

  onTaskDeleted(callback) {
    this.socket?.on("task:deleted", callback);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
