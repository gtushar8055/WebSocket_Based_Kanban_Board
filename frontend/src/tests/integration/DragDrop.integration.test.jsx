import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

describe("Drag and Drop Integration", () => {
  const mockOnDragEnd = vi.fn();

  const TestDragDropComponent = () => {
    const items = [
      { id: "1", content: "Item 1" },
      { id: "2", content: "Item 2" },
    ];

    return (
      <DragDropContext onDragEnd={mockOnDragEnd}>
        <Droppable droppableId="test-droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders draggable items", () => {
    render(<TestDragDropComponent />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders droppable area", () => {
    const { container } = render(<TestDragDropComponent />);

    const droppable = container.querySelector(
      '[data-rbd-droppable-id="test-droppable"]',
    );
    expect(droppable).toBeInTheDocument();
  });
});
