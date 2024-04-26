import { Page, expect, test } from "@playwright/test";
import { randomInt } from "crypto";

test.describe("Hook for Login Tests", () => {
    let page: Page;
    let adminUsername = "Admin";
    let adminPassword = "admin123";
    let randomNumber: number;
    let newEmpName = "Orange  Test";
    let newUsername: string;
    let newPassword = "admin123";

    test.beforeAll(async () => {
        await test.step("Before group tests", async () => { });
    });

    test.afterAll(async () => {
        await test.step("After group tests", async () => {
        });
    });

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        randomNumber = randomInt(10000, 9999999);
        newUsername = "annttruong+" + randomNumber;
        await test.step("Pre-condition 1: Go to OrangeHRM Login page", async () => {
            await page.goto(
                "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
            );
        });

        await test.step("Pre-condition 2: Login with Admin role", async () => {
            await page.locator("//label[text() = 'Username']//..//following-sibling::div//input").fill(adminUsername);
            await page.locator("//label[text() = 'Password']//..//following-sibling::div//input").fill(adminPassword);
            await page.locator("//button[normalize-space(.) = 'Login']").click();
        });

        await test.step("Pre-condition 3: Go to Admin page", async () => {
            await page.locator("//span[contains(@class, 'oxd-main-menu-item--name') and text() = 'Admin']").click();
        });

        await test.step("Pre-condition 4: Create new account", async () => {
            //Click Add button
            await page.locator("//button[contains(@class, 'oxd-button--secondary') and normalize-space(.) = 'Add']").click();

            //Select Role for new account
            await page.locator("//label[text() = 'User Role']//..//following-sibling::div//i").click()
            await page.locator("//div[@role = 'option']//span[text() = 'Admin']").click();

            //Select Status for new account
            await page.locator("//label[text() = 'Status']//..//following-sibling::div//i").click()
            await page.locator("//div[@role = 'option']//span[text() = 'Enabled']").click();

            //Fill account details
            await page.locator("//label[text() = 'Employee Name']//..//following-sibling::div//input").fill(newEmpName);
            await page.locator(`//div[@role = 'option']//span[text() = '${newEmpName}']`).click();
            await page.locator("//label[text() = 'Username']//..//following-sibling::div//input").fill(newUsername);
            await page.locator("//label[text() = 'Password']//..//following-sibling::div//input").fill(newPassword);
            await page.locator("//label[text() = 'Confirm Password']//..//following-sibling::div//input").fill(newPassword);

            //Click Save button
            await page.locator("//button[normalize-space(.) = 'Save']").click();
            await page.waitForURL("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");

            //Logout
            await page.locator("//p[contains(@class, 'oxd-userdropdown-name')]").click();
            await page.locator("//a[text() = 'Logout']").click();
        });
    });

    test.afterEach(async () => {
        await test.step("After each test: Close the page", async () => {
            await page.close();
        });
    });

    test("TC01: Verify that the user can log in successfully when provided the username and password correctly", async () => {
        await test.step("Step 1: Input valid credentials for the account created at pre-condition", async () => {
            await page.locator("//label[text() = 'Username']//..//following-sibling::div//input").fill(newUsername);
            await page.locator("//label[text() = 'Password']//..//following-sibling::div//input").fill(newPassword);
        });

        await test.step("Step 2: Click the Login button", async () => {
            await page.locator("//button[normalize-space(.) = 'Login']").click();
        });

        await test.step("Step 2 - VP: Verify that the Dashboard page is displayed", async () => {
            await expect(page).toHaveURL(
                "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"
            );
        });
    });

    test("TC02: Verify that the user can not log in successfully when providing username is empty", async () => {
        await test.step("Step 1: Leave the username with a blank value", async () => {
            await page.locator("//label[text() = 'Username']//..//following-sibling::div//input").fill("");
            await page.locator("//label[text() = 'Password']//..//following-sibling::div//input").fill(newPassword);
        });

        await test.step("Step 2: Click the Login button", async () => {
            await page.locator("//button[normalize-space(.) = 'Login']").click();
        });

        await test.step("Step 2 - VP: Verify that the “Required” message is displayed below the username textbox", async () => {
            await expect(page.locator("//label[text() = 'Username']//../..//span[contains(@class, 'oxd-input-field-error-message') and text() = 'Required']")).toBeVisible();
        });
    });
});