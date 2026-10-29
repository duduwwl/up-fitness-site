import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const widths = [320, 375, 390, 768, 1024, 1440, 1920];

async function settle(page: Page) {
  // Scroll through once so every entrance animation runs, then return to the top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

test.describe("layout", () => {
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await settle(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("no overflow in phone landscape", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/");
    await settle(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

test("no console errors, failed requests or broken images", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  await page.goto("/");
  await settle(page);
  const broken = await page.$$eval("img", (imgs) =>
    imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
  );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

test("links: no placeholder hrefs, anchors resolve, external links are safe", async ({ page }) => {
  await page.goto("/");
  const links = await page.$$eval("a", (as) =>
    as.map((a) => ({ href: a.getAttribute("href") ?? "", target: a.target, rel: a.rel, text: a.textContent ?? "" })),
  );
  for (const l of links) {
    expect(l.href, `empty link "${l.text}"`).not.toMatch(/^(#|)$/);
    if (l.href.startsWith("#")) {
      expect(await page.locator(l.href).count(), `missing target ${l.href}`).toBe(1);
    } else {
      expect(l.target).toBe("_blank");
      expect(l.rel).toContain("noopener");
      expect(l.text).toContain("abre em nova aba");
    }
  }
  const wa = links.filter((l) => l.href.includes("wa.me"));
  expect(wa.length).toBeGreaterThan(0);
  for (const l of wa) expect(l.href).toMatch(/^https:\/\/wa\.me\/5535998642278\?text=/);
});

test("nav anchor scrolls the section below the sticky header", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Planos" }).click();
  await expect(page).toHaveURL(/#planos$/);
  await page.waitForTimeout(400);
  const top = await page.locator("#planos-title").evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(64);
});

test("mobile menu opens, closes with Escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("navigation", { name: "Menu" });
  await expect(menu).toBeVisible();
  await expect(page.getByRole("button", { name: "Fechar menu" })).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();

  await page.getByRole("button", { name: "Abrir menu" }).click();
  await menu.getByRole("link", { name: "Dúvidas" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#duvidas$/);
});

test("FAQ opens by keyboard, one at a time", async ({ page }) => {
  await page.goto("/#duvidas");
  const items = page.locator("#duvidas details");
  await expect(items).toHaveCount(7);
  await items.nth(0).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(items.nth(0)).toHaveAttribute("open", "");
  await items.nth(2).locator("summary").focus();
  await page.keyboard.press("Space");
  await expect(items.nth(2)).toHaveAttribute("open", "");
  await expect(items.nth(0)).not.toHaveAttribute("open", "");
});

test("contact form validates and opens WhatsApp with the composed message", async ({ page }) => {
  await page.goto("/#contato");
  await page.evaluate(() => {
    (window as unknown as { opened: string[] }).opened = [];
    window.open = ((url: string) => {
      (window as unknown as { opened: string[] }).opened.push(url);
      return {} as Window;
    }) as typeof window.open;
  });
  const submit = page.getByRole("button", { name: /Abrir conversa no WhatsApp/ });
  await submit.click();
  await expect(page.getByText("Escreva seu nome (mínimo de 2 letras).")).toBeVisible();
  await expect(page.getByLabel("Seu nome")).toBeFocused();
  await expect(page.getByLabel("Seu nome")).toHaveAttribute("aria-invalid", "true");

  await page.getByLabel("Seu nome").fill("Ana");
  await page.getByLabel("Assunto").selectOption("Planos e valores");
  await page.getByLabel("Melhor período").selectOption("Noite");
  await submit.click();
  const opened = await page.evaluate(() => (window as unknown as { opened: string[] }).opened);
  expect(opened).toHaveLength(1);
  expect(decodeURIComponent(opened[0])).toContain("Meu nome é Ana.");
  await expect(page.getByRole("status")).toContainText("O WhatsApp foi aberto");
});

test("reduced motion keeps every section visible", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3108/");
  await settle(page);
  const hidden = await page.$$eval("[data-reveal]", (els) =>
    els.filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length,
  );
  expect(hidden).toBe(0);
  await ctx.close();
});

test("open status renders a real state", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#inicio [data-status]")).toContainText(/Aberta agora|Fechada agora/);
});

for (const width of [390, 1440]) {
  test(`axe WCAG 2.2 AA at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await settle(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}
