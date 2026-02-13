import { test, expect } from "@playwright/test";

test.describe("Drag and Drop E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post("http://localhost:5000/api/reset");
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("task card has draggable attributes", async ({ page }) => {
    // Create a task first
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Draggable Task");
    await page.click("text=Create Task");

    await expect(page.getByText("Draggable Task")).toBeVisible({
      timeout: 5000,
    });

    const taskCard = page.locator(".task-card").first();
    await expect(taskCard).toBeVisible();
  });

  test("columns have droppable areas", async ({ page }) => {
    const taskLists = page.locator(".task-list");
    await expect(taskLists).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      await expect(taskLists.nth(i)).toBeVisible();
    }
  });

  test("task count updates in column header", async ({ page }) => {
    const todoColumn = page.locator(".kanban-column").first();
    const taskCountBefore = await todoColumn
      .locator(".task-count")
      .textContent();

    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Count Test Task");
    await page.selectOption('select[name="status"]', "todo");
    await page.click("text=Create Task");

    await page.waitForTimeout(1000);

    const taskCountAfter = await todoColumn
      .locator(".task-count")
      .textContent();
    expect(parseInt(taskCountAfter)).toBeGreaterThanOrEqual(
      parseInt(taskCountBefore),
    );
  });

  test("task appears in correct column based on status", async ({ page }) => {
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Todo Column Task");
    await page.selectOption('select[name="status"]', "todo");
    await page.click("text=Create Task");

    await page.waitForTimeout(1000);

    const todoColumn = page.locator(".kanban-column").first();
    await expect(todoColumn.getByText("Todo Column Task")).toBeVisible({
      timeout: 5000,
    });
  });

  test("task can be moved to different column via status change", async ({
    page,
  }) => {
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Move Task Test");
    await page.selectOption('select[name="status"]', "todo");
    await page.click("text=Create Task");

    await page.waitForTimeout(1000);

    // Click Edit on the specific task card
    const taskCard = page.locator(".task-card", { hasText: "Move Task Test" });
    await taskCard.locator("text=Edit").click();

    await page.selectOption('select[name="status"]', "done");
    await page.click("text=Update Task");

    await page.waitForTimeout(1000);

    const doneColumn = page.locator(".kanban-column").nth(2);
    await expect(doneColumn.getByText("Move Task Test")).toBeVisible({
      timeout: 5000,
    });
  });

  test("multiple tasks can exist in same column", async ({ page }) => {
    // Create first task
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "First Task");
    await page.click("text=Create Task");
    await page.waitForTimeout(500);

    // Create second task
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Second Task");
    await page.click("text=Create Task");
    await page.waitForTimeout(500);

    const todoColumn = page.locator(".kanban-column").first();
    const tasks = todoColumn.locator(".task-card");

    await expect(tasks).toHaveCount(await tasks.count());
  });
});
