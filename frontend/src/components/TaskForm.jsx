import React, { useState } from "react";
import axios from "axios";
import "./TaskForm.css";

function TaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    category: task?.category || "feature",
    attachments: task?.attachments || [],
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Allowed: JPEG, PNG, GIF, PDF");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadError("");

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/upload`,
        formDataUpload,
      );

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, response.data],
      }));
    } catch (error) {
      setUploadError("Failed to upload file");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    onSubmit(task ? { ...formData, id: task.id } : formData);
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <h2>{task ? "✏️ Edit Task" : "➕ Create New Task"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              type="text"
              id="task-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
                <option value="enhancement">Enhancement</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-attachments">Attachments</label>
            <input
              type="file"
              id="task-attachments"
              onChange={handleFileUpload}
              accept=".jpg,.jpeg,.png,.gif,.pdf"
              disabled={uploading}
            />
            {uploading && <p className="upload-status">Uploading...</p>}
            {uploadError && <p className="upload-error">{uploadError}</p>}

            {formData.attachments.length > 0 && (
              <div className="attachments-list">
                {formData.attachments.map((att, idx) => (
                  <div key={idx} className="attachment-item">
                    📎 {att.filename}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {task ? "Update Task" : "Create Task"}
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
