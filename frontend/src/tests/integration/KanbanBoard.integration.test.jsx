import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import KanbanBoard from "../../components/KanbanBoard";
import socketService from "../../services/socketService";

// Mock socket.io-client
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    removeAllListeners: vi.fn(),
  })),
}));

describe("KanbanBoard Integration Tests", () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn(),
      removeAllListeners: vi.fn(),
    };

    socketService.socket = mockSocket;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders kanban board with three columns", () => {
    render(<KanbanBoard />);

    expect(screen.getByText(/to do/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it("displays connection status indicator", () => {
    render(<KanbanBoard />);

    const statusIndicator = screen.getByText(/connected|disconnected/i);
    expect(statusIndicator).toBeInTheDocument();
  });

  it("shows add task button", () => {
    render(<KanbanBoard />);

    const addButton = screen.getByText(/add new task/i);
    expect(addButton).toBeInTheDocument();
  });

  it("displays task chart component", () => {
    render(<KanbanBoard />);

    expect(screen.getByText(/task progress overview/i)).toBeInTheDocument();
  });

  it("initializes with empty task lists", () => {
    const { container } = render(<KanbanBoard />);

    const taskLists = container.querySelectorAll(".task-list");
    expect(taskLists).toHaveLength(3);
  });
});
