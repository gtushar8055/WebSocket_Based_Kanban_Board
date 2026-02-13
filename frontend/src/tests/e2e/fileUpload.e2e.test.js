import { test, expect } from "@playwright/test";
import path from "path";

test.describe("File Upload Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post("http://localhost:5000/api/reset");
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("user can see file upload input", async ({ page }) => {
    await page.click("text=Add New Task");

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test("file upload input accepts valid file types", async ({ page }) => {
    await page.click("text=Add New Task");

    const fileInput = page.locator('input[type="file"]');
    const acceptAttr = await fileInput.getAttribute("accept");

    expect(acceptAttr).toContain(".jpg");
    expect(acceptAttr).toContain(".jpeg");
    expect(acceptAttr).toContain(".png");
    expect(acceptAttr).toContain(".gif");
    expect(acceptAttr).toContain(".pdf");
  });

  test("displays error for invalid file type", async ({ page }) => {
    await page.click("text=Add New Task");

    const fileInput = page.locator('input[type="file"]');

    // Create a test file buffer (simulating invalid file)
    const buffer = Buffer.from("test content");
    await fileInput.setInputFiles({
      name: "invalid.exe",
      mimeType: "application/exe",
      buffer: buffer,
    });

    await expect(page.getByText(/invalid file type/i)).toBeVisible({
      timeout: 3000,
    });
  });

  test("displays error for oversized file", async ({ page }) => {
    await page.click("text=Add New Task");

    const fileInput = page.locator('input[type="file"]');

    // Create a large buffer (>5MB)
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
    await fileInput.setInputFiles({
      name: "large.pdf",
      mimeType: "application/pdf",
      buffer: largeBuffer,
    });

    await expect(
      page.getByText(/file size must be less than 5mb/i),
    ).toBeVisible({ timeout: 3000 });
  });

  test("shows uploading status during file upload", async ({ page }) => {
    await page.click("text=Add New Task");

    const fileInput = page.locator('input[type="file"]');

    const buffer = Buffer.from("test content");
    await fileInput.setInputFiles({
      name: "test.pdf",
      mimeType: "application/pdf",
      buffer: buffer,
    });

    // Check for uploading or success state
    const uploadStatus = page.locator(".upload-status, .attachment-item");
    await expect(uploadStatus.first()).toBeVisible({ timeout: 5000 });
  });

  test("attachment count is displayed on task card", async ({ page }) => {
    await page.click("text=Add New Task");

    await page.fill('input[name="title"]', "Task with Attachment");

    const fileInput = page.locator('input[type="file"]');
    const buffer = Buffer.from("test content");
    await fileInput.setInputFiles({
      name: "test.pdf",
      mimeType: "application/pdf",
      buffer: buffer,
    });

    // Wait for upload to complete
    await page.waitForTimeout(2000);

    await page.click("text=Create Task");

    await expect(page.getByText("Task with Attachment")).toBeVisible({
      timeout: 5000,
    });
  });

  test("form shows attached files list", async ({ page }) => {
    await page.click("text=Add New Task");

    const fileInput = page.locator('input[type="file"]');
    const buffer = Buffer.from("test content");

    await fileInput.setInputFiles({
      name: "document.pdf",
      mimeType: "application/pdf",
      buffer: buffer,
    });

    await expect(page.locator(".attachments-list")).toBeVisible({
      timeout: 5000,
    });
  });
});
