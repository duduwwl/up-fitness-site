import { defineConfig } from "@playwright/test";

// Runs against the production build (`pnpm build` first).
// Uses the locally installed Microsoft Edge (Chromium); Firefox/WebKit need `playwright install`.
const PORT = 3108;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.PW_CHANNEL ?? "msedge",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
  },
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
