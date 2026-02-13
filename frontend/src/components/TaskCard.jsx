import React from "react";
import "./TaskCard.css";

const PRIORITY_COLORS = {
  low: "#95a5a6",
  medium: "#f39c12",
  high: "#e74c3c",
};

const CATEGORY_ICONS = {
  bug: "🐛",
  feature: "✨",
  enhancement: "🔧",
};

function TaskCard({ task, onEdit, onDelete, isDragging }) {
  const priorityColor = PRIORITY_COLORS[task.priority] || "#95a5a6";

  return (
    <div className={`task-card ${isDragging ? "dragging" : ""}`}>
      <div className="task-card-header">
        <span className="category-badge">
          {CATEGORY_ICONS[task.category]} {task.category}
        </span>
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColor }}
        >
          {task.priority}
        </span>
      </div>

      <h4 className="task-title">{task.title}</h4>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.attachments && task.attachments.length > 0 && (
        <div className="task-attachments">
          📎 {task.attachments.length} attachment(s)
        </div>
      )}

      <div className="task-card-footer">
        <button className="edit-btn" onClick={() => onEdit(task)}>
          ✏️ Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
