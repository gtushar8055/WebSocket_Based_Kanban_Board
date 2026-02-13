import { test, expect } from "@playwright/test";

test.describe("Kanban Board E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Reset backend state before each test
    await page.request.post("http://localhost:5000/api/reset");
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("user can see kanban board with three columns", async ({ page }) => {
    await expect(page.getByText("Real-time Kanban Board")).toBeVisible();

    // Use column headers to avoid matching chart labels
    await expect(page.getByRole("heading", { name: /to do/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /in progress/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /done/i })).toBeVisible();
  });

  test("user can create a new task", async ({ page }) => {
    await page.click("text=Add New Task");

    await page.fill('input[name="title"]', "E2E Test Task");
    await page.fill(
      'textarea[name="description"]',
      "This is a test task created by E2E test",
    );
    await page.selectOption('select[name="priority"]', "high");
    await page.selectOption('select[name="category"]', "feature");

    await page.click("text=Create Task");

    await expect(page.getByText("E2E Test Task")).toBeVisible({
      timeout: 5000,
    });
  });

  test("user can edit an existing task", async ({ page }) => {
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Task to Edit");
    await page.click("text=Create Task");

    await expect(page.getByText("Task to Edit")).toBeVisible({ timeout: 5000 });

    // Click Edit on the specific task card
    const taskCard = page.locator(".task-card", { hasText: "Task to Edit" });
    await taskCard.locator(".edit-btn").click();

    await page.fill('input[name="title"]', "Edited Task Title");
    await page.click("text=Update Task");

    await expect(page.getByText("Edited Task Title")).toBeVisible({
      timeout: 5000,
    });
  });

  test("user can delete a task", async ({ page }) => {
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Task to Delete");
    await page.click("text=Create Task");

    await expect(page.getByText("Task to Delete")).toBeVisible({
      timeout: 5000,
    });

    // Set dialog handler before triggering delete
    page.on("dialog", (dialog) => dialog.accept());

    const taskCard = page.locator(".task-card", { hasText: "Task to Delete" });
    await taskCard.locator(".delete-btn").click();

    await expect(page.getByText("Task to Delete")).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("connection status indicator is visible", async ({ page }) => {
    const statusIndicator = page.locator(".status-indicator");
    await expect(statusIndicator).toBeVisible();

    const statusText = await statusIndicator.textContent();
    expect(statusText).toMatch(/connected|disconnected/i);
  });

  test("task progress chart is displayed", async ({ page }) => {
    await expect(page.getByText(/task progress overview/i)).toBeVisible();
    await expect(page.getByText(/total tasks/i)).toBeVisible();
    await expect(page.getByText(/completion/i)).toBeVisible();
  });

  test("user can cancel task creation", async ({ page }) => {
    await page.click("text=Add New Task");

    await expect(page.getByText(/create new task/i)).toBeVisible();

    await page.click("text=Cancel");

    await expect(page.getByText(/create new task/i)).not.toBeVisible();
  });
});
