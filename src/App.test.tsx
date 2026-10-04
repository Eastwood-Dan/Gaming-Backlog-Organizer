import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { de } from "./i18n/de";
import { t } from "./i18n";

beforeEach(() => localStorage.clear());

async function renderApp() {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByRole("heading", { name: de["app.title"] });
  return user;
}

function view(name: string) {
  return screen.getByRole("region", { name });
}

async function addGame(
  user: ReturnType<typeof userEvent.setup>,
  title: string
) {
  await user.type(screen.getByLabelText(de["add.titleLabel"]), title);
  await user.click(screen.getByRole("button", { name: de["add.submit"] }));
}

function action(status: Parameters<typeof actionLabel>[0], title: string) {
  return screen.getByRole("button", { name: actionLabel(status, title) });
}

function actionLabel(
  status: "Playing" | "Paused" | "Finished" | "Dropped" | "Unplayed",
  title: string
) {
  return t("action.forGame", { action: t(`action.${status}`), title });
}

function titlesIn(region: HTMLElement) {
  return within(region)
    .getAllByRole("heading", { level: 3 })
    .map((h) => h.textContent);
}

describe("App", () => {
  it("shows the app title from the translation file", async () => {
    await renderApp();
  });

  it("adds a Game to the Backlog by title", async () => {
    const user = await renderApp();
    await addGame(user, "Hades");
    expect(titlesIn(view(de["view.backlog"]))).toEqual(["Hades"]);
  });

  it("adds several Games from a pasted list, one title per line", async () => {
    const user = await renderApp();
    await user.click(
      screen.getByRole("button", { name: de["add.bulkToggle"] })
    );
    await user.click(screen.getByLabelText(de["add.bulkLabel"]));
    await user.paste("Hades\nCeleste\n\nTunic");
    await user.click(
      screen.getByRole("button", { name: de["add.bulkSubmit"] })
    );
    expect(titlesIn(view(de["view.backlog"]))).toEqual([
      "Hades",
      "Celeste",
      "Tunic",
    ]);
  });

  it("moves a Game between the views with buttons", async () => {
    const user = await renderApp();
    await addGame(user, "Hades");
    await user.click(action("Playing", "Hades"));
    expect(titlesIn(view(de["view.current"]))).toEqual(["Hades"]);

    await user.click(action("Finished", "Hades"));
    expect(titlesIn(view(de["view.played"]))).toEqual(["Hades"]);
    expect(within(view(de["view.played"])).getByText(/Beendet:/)).toBeVisible();
  });

  it("reorders the Backlog with up and down buttons", async () => {
    const user = await renderApp();
    await addGame(user, "Hades");
    await addGame(user, "Celeste");
    await user.click(
      screen.getByRole("button", {
        name: t("action.forGame", {
          action: de["game.moveUp"],
          title: "Celeste",
        }),
      })
    );
    expect(titlesIn(view(de["view.backlog"]))).toEqual(["Celeste", "Hades"]);
  });

  it("refuses to move a Game into a full Current and says why", async () => {
    const user = await renderApp();
    await user.click(
      screen.getByRole("button", { name: de["limit.decrease"] })
    );
    await user.click(
      screen.getByRole("button", { name: de["limit.decrease"] })
    );
    await user.click(
      screen.getByRole("button", { name: de["limit.decrease"] })
    );
    await addGame(user, "Hades");
    await addGame(user, "Celeste");
    await user.click(action("Playing", "Hades"));
    await user.click(action("Playing", "Celeste"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      t("error.currentFull", { count: 1, limit: 1 })
    );
    expect(titlesIn(view(de["view.current"]))).toEqual(["Hades"]);
  });

  it("deletes a Game only after confirmation", async () => {
    const user = await renderApp();
    await addGame(user, "Hades");
    const deleteButton = screen.getByRole("button", {
      name: t("action.forGame", { action: de["game.delete"], title: "Hades" }),
    });

    await user.click(deleteButton);
    await user.click(screen.getByRole("button", { name: de["delete.cancel"] }));
    expect(titlesIn(view(de["view.backlog"]))).toEqual(["Hades"]);

    await user.click(deleteButton);
    const dialog = screen.getByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: de["delete.confirm"] })
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(within(view(de["view.backlog"])).queryByText("Hades")).toBeNull();
  });

  it("keeps the Library after a reload", async () => {
    const user = await renderApp();
    await addGame(user, "Hades");
    await user.click(action("Playing", "Hades"));
    cleanup();

    await renderApp();
    expect(titlesIn(view(de["view.current"]))).toEqual(["Hades"]);
  });
});
