import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import socketService from "../services/socketService";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import TaskChart from "./TaskChart";
import "./KanbanBoard.css";

// Column configuration for the kanban board
const COLUMNS = {
  todo: { id: "todo", title: "📋 To Do", color: "#3498db" },
  inprogress: { id: "inprogress", title: "⚙️ In Progress", color: "#f39c12" },
  done: { id: "done", title: "✅ Done", color: "#2ecc71" },
};

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState(null);

  useEffect(() => {
    const socket = socketService.connect();

    // Socket may already be connected before listeners are attached
    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // Sync all tasks on initial connection
    socketService.onSyncTasks((syncedTasks) => {
      setTasks(syncedTasks);
    });

    // Real-time task updates
    socketService.onTaskCreated((newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socketService.onTaskUpdated((updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );
    });

    socketService.onTaskMoved(({ taskId, newStatus }) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );
    });

    socketService.onTaskDeleted((taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    });

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    socketService.moveTask(taskId, newStatus);
  };

  const handleCreateTask = (taskData) => {
    socketService.createTask(taskData);
    setShowTaskForm(false);
  };

  const handleUpdateTask = (taskData) => {
    socketService.updateTask(taskData);
    setShowTaskForm(false);
    setCurrentEditTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      socketService.deleteTask(taskId);
    }
  };

  const handleEditTask = (task) => {
    setCurrentEditTask(task);
    setShowTaskForm(true);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <div className="connection-status">
          <span
            className={`status-indicator ${isConnected ? "connected" : "disconnected"}`}
          >
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        </div>
        <button className="add-task-btn" onClick={() => setShowTaskForm(true)}>
          ➕ Add New Task
        </button>
      </div>

      {showTaskForm && (
        <TaskForm
          task={currentEditTask}
          onSubmit={currentEditTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setCurrentEditTask(null);
          }}
        />
      )}

      <TaskChart tasks={tasks} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {Object.values(COLUMNS).map((column) => (
            <div key={column.id} className="kanban-column">
              <div
                className="column-header"
                style={{ borderColor: column.color }}
              >
                <h3>{column.title}</h3>
                <span className="task-count">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={handleEditTask}
                              onDelete={handleDeleteTask}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
