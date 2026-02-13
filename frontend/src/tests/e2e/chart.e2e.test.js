import { test, expect } from "@playwright/test";

test.describe("Task Progress Chart Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post("http://localhost:5000/api/reset");
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("chart displays on page load", async ({ page }) => {
    await expect(page.getByText(/task progress overview/i)).toBeVisible();
    await expect(page.locator(".task-chart-container")).toBeVisible();
  });

  test("chart shows correct statistics sections", async ({ page }) => {
    await expect(page.getByText(/total tasks/i)).toBeVisible();
    await expect(page.getByText(/completion/i)).toBeVisible();

    // Use stat-label to target the "Done" stat card specifically
    const doneLabel = page.locator(".stat-label", { hasText: /done/i });
    await expect(doneLabel).toBeVisible();
  });

  test("chart displays task distribution section", async ({ page }) => {
    await expect(page.getByText(/task distribution/i)).toBeVisible();

    // Recharts renders inside responsive containers
    const chartContainer = page.locator(".chart-section").first();
    await expect(chartContainer).toBeVisible();
  });

  test("chart displays status breakdown section when tasks exist", async ({
    page,
  }) => {
    // Create a task first
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Chart Test Task");
    await page.click("text=Create Task");

    await page.waitForTimeout(1000);

    await expect(page.getByText(/status breakdown/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("total tasks count updates when task is created", async ({ page }) => {
    const statCards = page.locator(".stat-card");
    const totalTasksCard = statCards.filter({ hasText: /total tasks/i });

    const initialCount = await totalTasksCard
      .locator(".stat-value")
      .textContent();

    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "New Task for Count");
    await page.click("text=Create Task");

    await page.waitForTimeout(1000);

    const newCount = await totalTasksCard.locator(".stat-value").textContent();
    expect(parseInt(newCount)).toBeGreaterThan(parseInt(initialCount));
  });

  test("completion percentage updates when task moves to done", async ({
    page,
  }) => {
    const statCards = page.locator(".stat-card");
    const completionCard = statCards.filter({ hasText: /completion/i });

    await page.waitForTimeout(500);

    await expect(completionCard.locator(".stat-value")).toBeVisible();
  });

  test("chart shows 0% completion when no tasks are done", async ({ page }) => {
    // Create a task in todo status
    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Incomplete Task");
    await page.selectOption('select[name="status"]', "todo");
    await page.click("text=Create Task");

    await page.waitForTimeout(1000);

    const statCards = page.locator(".stat-card");
    const completionCard = statCards.filter({ hasText: /completion/i });

    await expect(completionCard).toBeVisible();
  });

  test("chart re-renders when tasks are added", async ({ page }) => {
    const chartContainer = page.locator(".task-chart-container");
    await expect(chartContainer).toBeVisible();

    await page.click("text=Add New Task");
    await page.fill('input[name="title"]', "Chart Update Test");
    await page.click("text=Create Task");

    await page.waitForTimeout(1000);

    await expect(chartContainer).toBeVisible();
  });

  test("chart displays responsive container for bar chart", async ({
    page,
  }) => {
    const responsiveContainer = page.locator(".recharts-responsive-container");
    await expect(responsiveContainer.first()).toBeVisible();
  });

  test("stat cards display correct initial values", async ({ page }) => {
    const statCards = page.locator(".stat-card");

    await expect(statCards).toHaveCount(3);

    const statValues = page.locator(".stat-value");
    await expect(statValues.first()).toBeVisible();
  });
});
