import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { BASE, createCheck, finish, newPage } from "./support/helpers";

// Prévia Black Friday (/black-friday-preview). Não altera a home nem a abertura.

const PREVIEW = BASE + "/black-friday-preview";
// Raiz da landing: o elemento marcado com data-bf-root. Não usar "main": o
// layout do site já tem um <main> que fica por baixo da prévia.
const ROOT = "[data-bf-root]";

async function trackOffsets(page: Page) {
  return page.evaluate(() => {
    const read = (part: string) => {
      const el = document.querySelector(`[class*="${part}"][class*="track"]`) as HTMLElement | null;
      if (!el) return null;
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.m41;
    };
    return { left: read("trackLeft"), right: read("trackRight") };
  });
}

for (const width of [360, 390, 1440]) {
  test.describe(`Prévia Black Friday em ${width} px`, () => {
    test("conteúdo, cards, sem rolagem horizontal e sem erros", async ({ browser }) => {
      const { context, page, errors } = await newPage(browser, width, { height: width < 500 ? 740 : 900 });
      const check = createCheck();
      await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible();

      const h1 = (await page.locator("h1").innerText()).toUpperCase().replace(/\s+/g, " ");
      check("h1 contém BLACK FRIDAY MYCOD", h1.includes("BLACK FRIDAY") && h1.includes("MYCOD"), h1);

      const cards = await page.locator("article").count();
      check("três cards de serviço", cards === 3, cards);

      const prices = await page.getByText("Preço a definir", { exact: true }).count();
      check("valor de cada card é 'Preço a definir'", prices === 3, prices);

      const buttons = await page.getByRole("button", { name: "Pedir orçamento" }).count();
      check("três botões 'Pedir orçamento'", buttons === 3, buttons);

      const text = await page.locator(ROOT).innerText();
      const commercial = /R\$|%/.test(text);
      check("sem valores, descontos ou percentuais inventados", !commercial);

      const overflow = await page.evaluate(() => {
        const root = document.querySelector("[data-bf-root]") as HTMLElement;
        return root.scrollWidth - root.clientWidth;
      });
      check("sem rolagem horizontal na raiz da landing", overflow <= 1, overflow);

      const mainsInside = await page.locator(`${ROOT} main`).count();
      check("nenhum <main> dentro da landing", mainsInside === 0, mainsInside);

      check("sem erros de console", errors.length === 0, errors);
      finish(check);
      await context.close();
    });

    test("fitas se movem em sentidos opostos e o hover destaca o card", async ({ browser }) => {
      const { context, page } = await newPage(browser, width, { height: width < 500 ? 740 : 900 });
      const check = createCheck();
      await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible();

      const a = await trackOffsets(page);
      await page.waitForTimeout(800);
      const b = await trackOffsets(page);
      const dl = (b.left ?? 0) - (a.left ?? 0);
      const dr = (b.right ?? 0) - (a.right ?? 0);
      check("fita 1 se move", Math.abs(dl) > 0.5, dl);
      check("fita 2 se move", Math.abs(dr) > 0.5, dr);
      check("fitas em sentidos opostos", dl * dr < 0, { dl, dr });

      const card = page.locator("article").first();
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      const before = await card.evaluate((el) => getComputedStyle(el).borderTopColor);
      await card.hover();
      await page.waitForTimeout(400);
      const after = await card.evaluate((el) => getComputedStyle(el).borderTopColor);
      check("hover muda a borda do card", before !== after, { before, after });

      finish(check);
      await context.close();
    });

    test("botões são demonstrativos e não navegam", async ({ browser }) => {
      const { context, page } = await newPage(browser, width, { height: width < 500 ? 740 : 900 });
      await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible();
      await page.getByRole("button", { name: "Solicitar proposta especial" }).click();
      await page.getByRole("button", { name: "Pedir orçamento" }).first().click();
      await page.waitForTimeout(300);
      expect(new URL(page.url()).pathname).toBe("/black-friday-preview");
      await context.close();
    });
  });
}

test("movimento reduzido: fitas estáticas", async ({ browser }) => {
  const { context, page } = await newPage(browser, 390, { height: 740, reducedMotion: "reduce" });
  await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  const names = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="track"]')).map((el) => getComputedStyle(el).animationName),
  );
  expect(names.length).toBeGreaterThan(0);
  expect(names.every((n) => n === "none")).toBe(true);
  await context.close();
});

test("metadata noindex/nofollow e sem link na home", async ({ browser }) => {
  const { context, page } = await newPage(browser, 1440, { height: 900 });
  await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toContain("noindex");
  expect(robots).toContain("nofollow");
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  expect(await page.locator('a[href="/black-friday-preview"]').count()).toBe(0);
  await context.close();
});
