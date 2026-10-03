import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { de } from "./i18n/de";

describe("App", () => {
  it("shows the app title from the translation file", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: de["app.title"] })
    ).toBeInTheDocument();
  });
});
