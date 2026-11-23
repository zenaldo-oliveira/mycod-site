import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { BASE, createCheck, finish, newPage } from "./support/helpers";

// Prévia isolada da abertura (/intro-preview). Não substitui os testes de
// components/home/MycodIntro.tsx, que validam a abertura atual da home.

const PREVIEW = BASE + "/intro-preview";
const STAGE = 'section[aria-label="Prévia da abertura MyCod"]';
const WORDMARK = `${STAGE} h1`;

async function wordmarkOpacity(page: Page) {
  return page.locator(WORDMARK).evaluate((el) => Number(getComputedStyle(el).opacity));
}

// A sequência dura 2 s; espera o quadro final estabilizar.
async function waitForFinal(page: Page) {
  await expect.poll(() => wordmarkOpacity(page), { timeout: 4000 }).toBe(1);
  await page.waitForTimeout(2100);
}

for (const width of [360, 390, 1440]) {
  test.describe(`Prévia da abertura em ${width} px`, () => {
    test("sequência roda, para no quadro final e não tem áudio nem vídeo", async ({ browser }) => {
      const { context, page, errors } = await newPage(browser, width, { height: width < 500 ? 740 : 900 });
      const check = createCheck();
      await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
      await expect(page.locator(STAGE)).toBeVisible();

      const h1 = await page.locator(WORDMARK).textContent();
      check("wordmark é o h1 com texto MyCod", h1?.trim() === "MyCod", h1);

      await waitForFinal(page);
      check("wordmark visível no quadro final", (await wordmarkOpacity(page)) === 1);

      const media = await page.locator("video, audio").count();
      check("sem vídeo ou áudio na prévia", media === 0, media);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check("sem rolagem horizontal", overflow <= 1, overflow);

      check("sem erros de console", errors.length === 0, errors);
      finish(check);
      await context.close();
    });

    test("metadata robots com noindex", async ({ browser }) => {
      const { context, page } = await newPage(browser, width, { height: 800 });
      const check = createCheck();
      await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      check("metadata robots com noindex", robots?.includes("noindex"), robots);
      finish(check);
      await context.close();
    });

    test("pular mostra o quadro final e repetir reinicia a sequência", async ({ browser }) => {
      const { context, page } = await newPage(browser, width, { height: 800 });
      const check = createCheck();
      await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
      await expect(page.locator(STAGE)).toBeVisible();
      await page.waitForTimeout(300);

      await page.getByRole("button", { name: "Pular animação" }).click();
      await expect.poll(() => wordmarkOpacity(page), { timeout: 500 }).toBe(1);
      check("pular leva ao quadro final em menos de 500 ms", true);

      await page.getByRole("button", { name: "Assistir de novo" }).click();
      const restarted = await wordmarkOpacity(page);
      check("repetir reinicia a sequência (wordmark oculto no início)", restarted < 0.5, restarted);

      await waitForFinal(page);
      check("repetir chega ao quadro final", (await wordmarkOpacity(page)) === 1);
      finish(check);
      await context.close();
    });

    test("Esc pula a sequência", async ({ browser }) => {
      const { context, page } = await newPage(browser, width, { height: 800 });
      await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
      await expect(page.locator(STAGE)).toBeVisible();
      // Esc só age após a hidratação: espera a sequência começar.
      await expect.poll(() => wordmarkOpacity(page), { timeout: 4000 }).toBeGreaterThan(0);
      await page.keyboard.press("Escape");
      await expect.poll(() => wordmarkOpacity(page), { timeout: 1500 }).toBe(1);
      await context.close();
    });
  });
}

test("movimento reduzido: quadro final direto, sem animação", async ({ browser }) => {
  const { context, page } = await newPage(browser, 390, { height: 740, reducedMotion: "reduce" });
  await page.goto(PREVIEW, { waitUntil: "domcontentloaded" });
  await expect.poll(() => wordmarkOpacity(page), { timeout: 500 }).toBe(1);
  await context.close();
});

test("a prévia não é linkada a partir da home", async ({ browser }) => {
  const { context, page } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const links = await page.locator('a[href="/intro-preview"]').count();
  expect(links).toBe(0);
  await context.close();
});
