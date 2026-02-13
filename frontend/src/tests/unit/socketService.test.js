import { describe, it, expect, beforeEach, vi } from "vitest";
import socketService from "../../services/socketService";

describe("SocketService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("has createTask method", () => {
    expect(typeof socketService.createTask).toBe("function");
  });

  it("has updateTask method", () => {
    expect(typeof socketService.updateTask).toBe("function");
  });

  it("has moveTask method", () => {
    expect(typeof socketService.moveTask).toBe("function");
  });

  it("has deleteTask method", () => {
    expect(typeof socketService.deleteTask).toBe("function");
  });

  it("has connect method", () => {
    expect(typeof socketService.connect).toBe("function");
  });

  it("has disconnect method", () => {
    expect(typeof socketService.disconnect).toBe("function");
  });

  it("createTask accepts task data", () => {
    const mockSocket = {
      emit: vi.fn(),
    };
    socketService.socket = mockSocket;

    const taskData = { title: "Test Task", status: "todo" };
    socketService.createTask(taskData);

    expect(mockSocket.emit).toHaveBeenCalledWith("task:create", taskData);
  });

  it("updateTask accepts task data", () => {
    const mockSocket = {
      emit: vi.fn(),
    };
    socketService.socket = mockSocket;

    const taskData = { id: 1, title: "Updated Task" };
    socketService.updateTask(taskData);

    expect(mockSocket.emit).toHaveBeenCalledWith("task:update", taskData);
  });

  it("moveTask accepts taskId and newStatus", () => {
    const mockSocket = {
      emit: vi.fn(),
    };
    socketService.socket = mockSocket;

    socketService.moveTask(1, "done");

    expect(mockSocket.emit).toHaveBeenCalledWith("task:move", {
      taskId: 1,
      newStatus: "done",
    });
  });

  it("deleteTask accepts taskId", () => {
    const mockSocket = {
      emit: vi.fn(),
    };
    socketService.socket = mockSocket;

    socketService.deleteTask(1);

    expect(mockSocket.emit).toHaveBeenCalledWith("task:delete", 1);
  });
});
