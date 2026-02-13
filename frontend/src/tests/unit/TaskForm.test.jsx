import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import TaskForm from "../../components/TaskForm";
import axios from "axios";

vi.mock("axios");

describe("TaskForm Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create form correctly", () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText(/create new task/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter task title/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/create task/i)).toBeInTheDocument();
  });

  it("renders edit form with existing task data", () => {
    const existingTask = {
      id: 1,
      title: "Existing Task",
      description: "Existing Description",
      status: "inprogress",
      priority: "high",
      category: "bug",
      attachments: [],
    };

    render(
      <TaskForm
        task={existingTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText(/edit task/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Existing Description"),
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText(/enter task title/i);
    const descriptionInput = screen.getByPlaceholderText(
      /enter task description/i,
    );
    const submitButton = screen.getByText(/create task/i);

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "New Description" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Task",
          description: "New Description",
        }),
      );
    });
  });

  it("does not submit when title is empty", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByText(/create task/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("handles priority selection", () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const prioritySelect = screen.getByLabelText(/priority/i);
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    expect(prioritySelect.value).toBe("high");
  });

  it("handles category selection", () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: "bug" } });

    expect(categorySelect.value).toBe("bug");
  });

  it("displays error for invalid file type", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const fileInput = screen.getByLabelText(/attachments/i);
    const invalidFile = new File(["content"], "test.exe", {
      type: "application/exe",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    });
  });

  it("handles successful file upload", async () => {
    axios.post.mockResolvedValue({
      data: {
        filename: "test.pdf",
        path: "/uploads/test.pdf",
        size: 1024,
      },
    });

    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const fileInput = screen.getByLabelText(/attachments/i);
    const validFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
    });
  });
});
