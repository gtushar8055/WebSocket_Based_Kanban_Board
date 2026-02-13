import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskChart from "../../components/TaskChart";

describe("TaskChart Component", () => {
  it("renders chart with task statistics", () => {
    const tasks = [
      { id: 1, status: "todo", title: "Task 1" },
      { id: 2, status: "todo", title: "Task 2" },
      { id: 3, status: "inprogress", title: "Task 3" },
      { id: 4, status: "done", title: "Task 4" },
    ];

    render(<TaskChart tasks={tasks} />);

    expect(screen.getByText(/task progress overview/i)).toBeInTheDocument();
    expect(screen.getByText(/total tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/completion/i)).toBeInTheDocument();
  });

  it("calculates total tasks correctly", () => {
    const tasks = [
      { id: 1, status: "todo", title: "Task 1" },
      { id: 2, status: "inprogress", title: "Task 2" },
      { id: 3, status: "done", title: "Task 3" },
    ];

    render(<TaskChart tasks={tasks} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calculates completion percentage correctly", () => {
    const tasks = [
      { id: 1, status: "todo", title: "Task 1" },
      { id: 2, status: "todo", title: "Task 2" },
      { id: 3, status: "done", title: "Task 3" },
      { id: 4, status: "done", title: "Task 4" },
    ];

    render(<TaskChart tasks={tasks} />);

    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("displays 0% completion when no tasks are done", () => {
    const tasks = [
      { id: 1, status: "todo", title: "Task 1" },
      { id: 2, status: "inprogress", title: "Task 2" },
    ];

    render(<TaskChart tasks={tasks} />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("displays 100% completion when all tasks are done", () => {
    const tasks = [
      { id: 1, status: "done", title: "Task 1" },
      { id: 2, status: "done", title: "Task 2" },
    ];

    render(<TaskChart tasks={tasks} />);

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("handles empty task list", () => {
    render(<TaskChart tasks={[]} />);

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders chart titles", () => {
    const tasks = [{ id: 1, status: "todo", title: "Task 1" }];

    render(<TaskChart tasks={tasks} />);

    expect(screen.getByText(/task distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/status breakdown/i)).toBeInTheDocument();
  });
});
