import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import TaskForm from "../../components/TaskForm";
import TaskCard from "../../components/TaskCard";

describe("Task Form and Card Integration", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("form submits task data that can be displayed in card", async () => {
    const { rerender } = render(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const titleInput = screen.getByPlaceholderText(/enter task title/i);
    const descriptionInput = screen.getByPlaceholderText(
      /enter task description/i,
    );
    const prioritySelect = screen.getByLabelText(/priority/i);
    const categorySelect = screen.getByLabelText(/category/i);

    fireEvent.change(titleInput, {
      target: { value: "Integration Test Task" },
    });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    fireEvent.change(categorySelect, { target: { value: "bug" } });

    const submitButton = screen.getByText(/create task/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Integration Test Task",
          description: "Test Description",
          priority: "high",
          category: "bug",
        }),
      );
    });

    const submittedTask = mockOnSubmit.mock.calls[0][0];

    rerender(
      <TaskCard
        task={{ ...submittedTask, id: 1 }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    expect(screen.getByText("Integration Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText(/bug/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it("task card can trigger edit and display form with task data", () => {
    const existingTask = {
      id: 1,
      title: "Existing Task",
      description: "Existing Description",
      status: "todo",
      priority: "medium",
      category: "feature",
      attachments: [],
    };

    const { rerender } = render(
      <TaskCard
        task={existingTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(existingTask);

    rerender(
      <TaskForm
        task={existingTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Existing Description"),
    ).toBeInTheDocument();
  });

  it("handles complete task lifecycle: create, display, edit, delete", async () => {
    const { rerender } = render(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    // Step 1: Create task
    fireEvent.change(screen.getByPlaceholderText(/enter task title/i), {
      target: { value: "Lifecycle Task" },
    });
    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const createdTask = { ...mockOnSubmit.mock.calls[0][0], id: 1 };

    // Step 2: Display task
    rerender(
      <TaskCard
        task={createdTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={false}
      />,
    );

    expect(screen.getByText("Lifecycle Task")).toBeInTheDocument();

    // Step 3: Edit task
    fireEvent.click(screen.getByText(/edit/i));
    expect(mockOnEdit).toHaveBeenCalledWith(createdTask);

    // Step 4: Delete task
    fireEvent.click(screen.getByText(/delete/i));
    expect(mockOnDelete).toHaveBeenCalledWith(createdTask.id);
  });
});
