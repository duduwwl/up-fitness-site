import { describe, expect, it } from "vitest";
import { hashManagementCode, membershipRequestSchema, privacyRequestSchema } from "./membership-request";

const valid = {
  planSlug: "economico", fullName: "  Pessoa   Teste ", email: "TESTE@EXAMPLE.COM",
  phone: "(35) 99999-9999", paymentMethod: "pix", consent: true,
  idempotencyKey: "00000000-0000-4000-8000-000000000001", website: "",
};

describe("membership request boundary", () => {
  it("normalizes only allowlisted fields", () => {
    const result = membershipRequestSchema.parse(valid);
    expect(result.fullName).toBe("Pessoa Teste");
    expect(result.email).toBe("teste@example.com");
    expect(result.phone).toBe("5535999999999");
  });

  it.each([
    { ...valid, planSlug: "x'; drop table membership_requests; --" },
    { ...valid, extra: "unexpected" },
    { ...valid, consent: false },
    { ...valid, website: "bot" },
  ])("rejects hostile or unknown input", (payload) => {
    expect(membershipRequestSchema.safeParse(payload).success).toBe(false);
  });

  it("keeps XSS as inert text and hashes management codes", () => {
    const parsed = membershipRequestSchema.parse({ ...valid, fullName: "<script>alert(1)</script>" });
    expect(parsed.fullName).toBe("<script>alert(1)</script>");
    expect(hashManagementCode("secret")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("requires both privacy credentials", () => {
    expect(privacyRequestSchema.safeParse({ requestId: valid.idempotencyKey }).success).toBe(false);
  });
});
