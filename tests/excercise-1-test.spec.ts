import { expect, test } from "@playwright/test";

test("TC01: Buy an item successfully", async ({ page }) => {
    let userName = "rahulshetty@gmail.com";
    let userPass = "Iamking@000";
    let country = "Vietnam";
    let productName = "IPHONE 13 PRO";
    let orderID: string | null;

    await test.step("Step 1: Go to rRahul Shetty Academy page", async () => {
        await page.goto("https://rahulshettyacademy.com/client");
    });

    await test.step("Step 2: Enter valid username and password", async () => {
        await page.locator("//input[@id = 'userEmail']").fill(userName);
        await page.locator("//input[@id = 'userPassword']").fill(userPass);
    });

    await test.step("Step 3: Click on Login button", async () => {
        await page.locator("//input[@id = 'login']").click();
    });

    await test.step("Step 4: Click on “Add to Cart” for iPhone 13 PRO item", async () => {
        await page.locator(`//b[text() = '${productName}']//ancestor::div[contains(@class, 'card-body')]//button[normalize-space(text()) = 'Add To Cart']`).click();
    });

    await test.step("Step 5: Go to the Cart page by clicking on the Cart button", async () => {
        await page.locator("//button[contains(@routerlink, '/dashboard/cart')]").click();
    });

    await test.step("Step 6: Click on 'Check out' button", async () => {
        await page.locator("//button[text() = 'Checkout']").click();
    });

    await test.step("Step 7: Select country", async () => {
        await page.locator("//input[@placeholder = 'Select Country']").pressSequentially(country);
        await page.locator(`//span[contains(@class, 'ng-star-inserted') and contains(normalize-space(.), '${country}')]`).click();
    });

    await test.step("Step 8: Click on 'Place Order'", async () => {
        await page.locator("//a[normalize-space(text()) = 'Place Order']").click();
    });

    await test.step("Step 9: Get Order ID", async () => {
        orderID = await page.locator("//label[contains(@class, 'ng-star-inserted')]").textContent();
        if (orderID != null) {
            orderID = orderID.replace("|", "").replace("|", "").trim();
        }
    });

    await test.step("Step 10: Go to Order History Page", async () => {
        await page.locator("//label[@routerlink = '/dashboard/myorders']").click();
    });

    await test.step("Step 10 - VP: Verify Order ID", async () => {
        if (orderID != null) {
            await expect(page.locator("//tr[contains(@class, 'ng-star-inserted')]//th")).toHaveText(orderID);
        } else {
            test.fail()
        }
    });
});