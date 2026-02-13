import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import TaskCard from "../../components/TaskCard";

describe("TaskCard Component", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: "todo",
    priority: "high",
    category: "bug",
    attachments: [],
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders task information correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText(/bug/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("displays attachment count when attachments exist", () => {
    const taskWithAttachments = {
      ...mockTask,
      attachments: [{ filename: "file1.pdf" }, { filename: "file2.png" }],
    };

    render(
      <TaskCard
        task={taskWithAttachments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    expect(screen.getByText(/2 attachment/i)).toBeInTheDocument();
  });

  it("applies dragging class when isDragging is true", () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={true}
      />,
    );

    const taskCard = container.querySelector(".task-card");
    expect(taskCard).toHaveClass("dragging");
  });

  it("renders correct priority badge color", () => {
    const { rerender } = render(
      <TaskCard
        task={{ ...mockTask, priority: "high" }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    let priorityBadge = screen.getByText(/high/i);
    expect(priorityBadge).toHaveStyle({ backgroundColor: "#e74c3c" });

    rerender(
      <TaskCard
        task={{ ...mockTask, priority: "medium" }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    priorityBadge = screen.getByText(/medium/i);
    expect(priorityBadge).toHaveStyle({ backgroundColor: "#f39c12" });
  });
});
