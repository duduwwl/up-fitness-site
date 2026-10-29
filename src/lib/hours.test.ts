import { describe, expect, it } from "vitest";
import { formatTime, getOpenStatus, rangeText } from "./hours";

// São Paulo is UTC-3 (no DST since 2019), so 07:30Z is 04:30 local.
const at = (iso: string) => new Date(iso);

describe("getOpenStatus", () => {
  it("opens at 4h30 on weekdays", () => {
    expect(getOpenStatus(at("2026-10-28T07:29:00Z")).open).toBe(false); // Wed 04:29
    expect(getOpenStatus(at("2026-10-28T07:30:00Z"))).toEqual({
      open: true,
      text: "Aberta agora · fecha à meia-noite",
    });
  });

  it("closes at midnight and points to the next opening", () => {
    // Fri 23:59 local is open; Sat 00:00 local is closed until 7h.
    expect(getOpenStatus(at("2026-10-31T02:59:00Z")).open).toBe(true);
    expect(getOpenStatus(at("2026-10-31T03:00:00Z")).text).toBe(
      "Fechada agora · abre hoje às 7h",
    );
  });

  it("handles saturday evening and sunday afternoon", () => {
    expect(getOpenStatus(at("2026-10-31T21:30:00Z")).text).toBe(
      "Fechada agora · abre amanhã às 8h",
    ); // Sat 18:30
    expect(getOpenStatus(at("2026-11-01T16:00:00Z")).text).toBe(
      "Fechada agora · abre amanhã às 4h30",
    ); // Sun 13:00
  });
});

describe("rangeText", () => {
  it("uses 'à meia-noite' for midnight and 'às' otherwise", () => {
    expect(rangeText("04:30", "24:00")).toBe("4h30 à meia-noite");
    expect(rangeText("07:00", "18:00")).toBe("7h às 18h");
  });
});

describe("formatTime", () => {
  it("formats Brazilian style", () => {
    expect(formatTime("04:30")).toBe("4h30");
    expect(formatTime("18:00")).toBe("18h");
    expect(formatTime("24:00")).toBe("meia-noite");
  });
});
