import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TextEffects } from "./text-effects";
import { supportsHtmlInCanvas } from "./flame-wrap";

describe("motion accessibility fallbacks", () => {
  it("preserves text, whitespace and heading semantics without JavaScript", () => {
    const html = renderToStaticMarkup(createElement(TextEffects, null, createElement("h2", { id: "plans" }, "Planos da UP")));
    expect(html).toContain('<h2 id="plans">');
    expect(html.replace(/<[^>]*>/g, "")).toBe("Planos da UP");
    expect(html).not.toContain('aria-hidden="true"');
    expect(html.match(/class="text-word"/g)).toHaveLength(3);
  });
  it("does not split form options or live status", () => {
    const html = renderToStaticMarkup(createElement(TextEffects, null,
      createElement("select", null, createElement("option", null, "Meu plano")),
      createElement("span", { "data-status": true }, "Aberta agora"),
    ));
    expect(html).not.toContain('class="text-word"');
  });
  it("keeps control labels intact", () => {
    const html = renderToStaticMarkup(createElement(TextEffects, null,
      createElement("a", { href: "#planos" }, "Ver planos"),
      createElement("button", null, "Abrir conversa"),
    ));
    expect(html).not.toContain('class="text-word"');
  });
  it("does not activate experimental rendering during server rendering", () => {
    expect(supportsHtmlInCanvas()).toBe(false);
  });
});
