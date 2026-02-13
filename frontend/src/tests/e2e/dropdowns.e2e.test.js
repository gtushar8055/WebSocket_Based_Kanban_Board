import { test, expect } from "@playwright/test";

test.describe("Priority and Category Dropdown Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post("http://localhost:5000/api/reset");
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("user can select task priority", async ({ page }) => {
    await page.click("text=Add New Task");

    const prioritySelect = page.locator('select[name="priority"]');
    await expect(prioritySelect).toBeVisible();

    await prioritySelect.selectOption("low");
    expect(await prioritySelect.inputValue()).toBe("low");

    await prioritySelect.selectOption("medium");
    expect(await prioritySelect.inputValue()).toBe("medium");

    await prioritySelect.selectOption("high");
    expect(await prioritySelect.inputValue()).toBe("high");
  });

  test("user can select task category", async ({ page }) => {
    await page.click("text=Add New Task");

    const categorySelect = page.locator('select[name="category"]');
    await expect(categorySelect).toBeVisible();

    await categorySelect.selectOption("bug");
    expect(await categorySelect.inputValue()).toBe("bug");

    await categorySelect.selectOption("feature");
    expect(await categorySelect.inputValue()).toBe("feature");

    await categorySelect.selectOption("enhancement");
    expect(await categorySelect.inputValue()).toBe("enhancement");
  });

  test("task displays selected priority badge", async ({ page }) => {
    await page.click("text=Add New Task");

    await page.fill('input[name="title"]', "Priority Test Task");
    await page.selectOption('select[name="priority"]', "high");
    await page.click("text=Create Task");

    await expect(page.getByText("Priority Test Task")).toBeVisible({
      timeout: 5000,
    });

    // Scope to the specific task card to avoid matching badges from other tasks
    const taskCard = page.locator(".task-card", {
      hasText: "Priority Test Task",
    });
    const priorityBadge = taskCard.locator(".priority-badge");
    await expect(priorityBadge).toBeVisible();
    await expect(priorityBadge).toHaveText(/high/i);
  });

  test("task displays selected category badge", async ({ page }) => {
    await page.click("text=Add New Task");

    await page.fill('input[name="title"]', "Category Test Task");
    await page.selectOption('select[name="category"]', "bug");
    await page.click("text=Create Task");

    await expect(page.getByText("Category Test Task")).toBeVisible({
      timeout: 5000,
    });

    const categoryBadge = page
      .locator(".category-badge")
      .filter({ hasText: /bug/i });
    await expect(categoryBadge).toBeVisible();
  });

  test("user can change priority when editing task", async ({ page }) => {
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Change Priority Task");
    await page.selectOption('select[name="priority"]', "low");
    await page.click("text=Create Task");

    await expect(page.getByText("Change Priority Task")).toBeVisible({
      timeout: 5000,
    });

    // Click Edit on the specific task card
    const taskCard = page.locator(".task-card", {
      hasText: "Change Priority Task",
    });
    await taskCard.locator("text=Edit").click();

    const prioritySelect = page.locator('select[name="priority"]');
    await prioritySelect.selectOption("high");

    await page.click("text=Update Task");

    // Scope badge check to the specific task
    const updatedCard = page.locator(".task-card", {
      hasText: "Change Priority Task",
    });
    const priorityBadge = updatedCard.locator(".priority-badge");
    await expect(priorityBadge).toHaveText(/high/i, { timeout: 5000 });
  });

  test("default values are set for priority and category", async ({ page }) => {
    await page.click("text=Add New Task");

    const prioritySelect = page.locator('select[name="priority"]');
    const categorySelect = page.locator('select[name="category"]');

    expect(await prioritySelect.inputValue()).toBe("medium");
    expect(await categorySelect.inputValue()).toBe("feature");
  });
});
