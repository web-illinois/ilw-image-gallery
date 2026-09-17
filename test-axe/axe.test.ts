import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { axeTestFunction } from "@illinois-toolkit/ilw-core";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

test.describe("homepage", () => {
    test("should not have any automatically detectable accessibility issues", async ({page}, testInfo) => {
        const result = await axeTestFunction(page, testInfo);

        expect(result).toBeTruthy();
    });

    test("open modal should not have any automatically detectable accessibility issues", async ({page}) => {
        await page.goto("./samples/variations.html", {waitUntil: "domcontentloaded"});
        await page.locator("a[data-gallery-item]").first().click();
        await expect(page.getByRole("dialog").first()).toBeVisible();
        await expect(page.locator("ilw-modal[open] .backdrop")).toHaveCSS("opacity", "1");

        const results = await new AxeBuilder({page})
            .withTags(wcagTags)
            .analyze();

        expect(results.violations).toEqual([]);
    });
});
