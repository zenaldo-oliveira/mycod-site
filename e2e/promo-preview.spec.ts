import { expect, test } from "@playwright/test";
import { BASE, createCheck, finish, newPage } from "./support/helpers";

// Prévias de serviços e promoções. Medições sempre na raiz marcada com data-promo-root.

const ROOT = "[data-promo-root]";
const PAGES = [
  { path: "/servicos-preview", title: "Serviços da MyCod" },
  { path: "/promocoes-preview", title: "Promoções MyCod" },
];

for (const width of [360, 390, 1440]) {
  for (const p of PAGES) {
    test(`${p.path} em ${width} px: conteúdo, sem rolagem horizontal, um só bloco de conteúdo`, async ({ browser }) => {
      const { context, page, errors } = await newPage(browser, width, { height: width < 500 ? 740 : 900 });
      const check = createCheck();
      const response = await page.goto(BASE + p.path, { waitUntil: "domcontentloaded" });
      check("rota responde 200", response?.status() === 200, response?.status());
      await expect(page.locator(`${ROOT} h1`)).toHaveText(p.title);

      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      check("noindex e nofollow", robots?.includes("noindex") && robots?.includes("nofollow"), robots);

      const overflow = await page.evaluate(() => {
        const root = document.querySelector("[data-promo-root]") as HTMLElement;
        return root.scrollWidth - root.clientWidth;
      });
      check("sem rolagem horizontal na raiz", overflow <= 1, overflow);

      const mains = await page.locator(`${ROOT} main`).count();
      check("nenhum <main> dentro da prévia", mains === 0, mains);

      const text = await page.locator(ROOT).innerText();
      check("sem valores, descontos ou percentuais inventados", !/R\$|%/.test(text));

      check("sem erros de console", errors.length === 0, errors);
      finish(check);
      await context.close();
    });
  }
}

test("serviços: três cards com 'Preço a definir'", async ({ browser }) => {
  const { context, page } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/servicos-preview", { waitUntil: "domcontentloaded" });
  await expect(page.locator(`${ROOT} article`)).toHaveCount(3);
  await expect(page.locator(`${ROOT}`).getByText("Preço a definir", { exact: true })).toHaveCount(3);
  await context.close();
});

test("promoções: estado vazio, sem cards reais", async ({ browser }) => {
  const { context, page } = await newPage(browser, 390, { height: 740 });
  await page.goto(BASE + "/promocoes-preview", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status")).toContainText("Nenhuma promoção publicada");
  // O exemplo de layout fica inerte: fora da ordem de foco.
  const inert = await page.locator(`${ROOT} [inert]`).count();
  expect(inert).toBe(1);
  await context.close();
});

test("as prévias não aparecem na home nem no sitemap", async ({ browser }) => {
  const { context, page } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  expect(await page.locator('a[href="/servicos-preview"], a[href="/promocoes-preview"]').count()).toBe(0);
  const sitemap = await (await page.request.get(BASE + "/sitemap.xml")).text();
  expect(sitemap).not.toContain("preview");
  await context.close();
});

test("cards com moldura animada e botões com borda animada", async ({ browser }) => {
  const { context, page } = await newPage(browser, 1440, { height: 900 });
  await page.goto(BASE + "/servicos-preview", { waitUntil: "domcontentloaded" });
  await expect(page.locator(`${ROOT} article`).first()).toBeVisible();
  const card = await page.locator(`${ROOT} article`).first().evaluate((el) => getComputedStyle(el, "::after").animationName);
  expect(card).not.toBe("none");
  const button = await page.locator(`${ROOT} button`).first().evaluate((el) => getComputedStyle(el, "::before").animationName);
  expect(button).not.toBe("none");
  await context.close();
});
