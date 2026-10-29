import { describe, expect, it } from "vitest";
import { buildContactMessage, validateContact } from "./contact-message";
import { whatsappUrl } from "./links";

const valid = { name: "  Ana  ", interest: "Planos e valores", period: "Noite", message: "" };

describe("validateContact", () => {
  it("accepts a complete form", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("rejects short names, unknown options and long messages", () => {
    const errors = validateContact({
      name: " a ",
      interest: "x",
      period: "",
      message: "m".repeat(301),
    });
    expect(Object.keys(errors).sort()).toEqual(["interest", "message", "name", "period"]);
  });
});

describe("buildContactMessage", () => {
  it("builds a trimmed message and a wa.me link to the confirmed number", () => {
    const text = buildContactMessage({ ...valid, message: " Posso levar meu filho? " });
    expect(text).toBe(
      "Olá! Meu nome é Ana.\nAssunto: Planos e valores.\nMelhor período para visitar: noite.\nPosso levar meu filho?",
    );
    expect(whatsappUrl(text)).toMatch(/^https:\/\/wa\.me\/5535998642278\?text=Ol%C3%A1/);
  });
});
