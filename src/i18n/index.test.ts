import { describe, expect, it } from "vitest";
import { t } from "./index";

describe("t", () => {
  it("returns the plain string for a key", () => {
    expect(t("view.backlog")).toBe("Backlog");
  });

  it("fills placeholders", () => {
    expect(t("game.started", { date: "04.10.2026" })).toBe(
      "Gestartet: 04.10.2026"
    );
  });
});
