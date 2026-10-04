import { describe, expect, it } from "vitest";
import {
  addGames,
  backlog,
  createLibrary,
  current,
  moveDown,
  moveUp,
  removeGame,
  statusTargets,
  parseTitles,
  played,
  setCurrentLimit,
  setStatus,
  type Library,
  type Status,
} from "./library";

function ids() {
  let n = 0;
  return () => `id-${++n}`;
}

function titles(games: { title: string }[]) {
  return games.map((g) => g.title);
}

describe("parseTitles", () => {
  it("returns one title per non-empty line, trimmed", () => {
    expect(parseTitles("Hades\n  Celeste  \r\n\n   \nTunic")).toEqual([
      "Hades",
      "Celeste",
      "Tunic",
    ]);
  });
});

describe("addGames", () => {
  it("adds Games as Unplayed at the bottom of the Backlog, in the given order", () => {
    let library: Library = createLibrary();
    library = addGames(library, ["Hades"], ids());
    library = addGames(library, ["Celeste", "Tunic"], ids());

    expect(titles(backlog(library))).toEqual(["Hades", "Celeste", "Tunic"]);
    expect(backlog(library).every((g) => g.status === "Unplayed")).toBe(true);
    expect(backlog(library)[0]).toMatchObject({
      startedAt: null,
      endedAt: null,
    });
  });

  it("ignores blank titles", () => {
    const library = addGames(createLibrary(), ["  ", "Hades", ""], ids());
    expect(titles(library.games)).toEqual(["Hades"]);
  });
});

const T1 = new Date("2026-01-01T10:00:00.000Z");
const T2 = new Date("2026-02-01T10:00:00.000Z");
const T3 = new Date("2026-03-01T10:00:00.000Z");

function libraryOf(...gameTitles: string[]): Library {
  return addGames(createLibrary(), gameTitles, ids());
}

function id(library: Library, title: string): string {
  return library.games.find((g) => g.title === title)!.id;
}

/** Applies a Status change that must succeed. */
function move(library: Library, title: string, status: Status, now: Date) {
  const result = setStatus(library, id(library, title), status, now);
  if (!result.ok) throw new Error(`move refused: ${result.reason}`);
  return result.library;
}

function game(library: Library, title: string) {
  return library.games.find((g) => g.title === title)!;
}

describe("setStatus dates", () => {
  it("sets the start date when a Game becomes Playing", () => {
    const library = move(libraryOf("Hades"), "Hades", "Playing", T1);
    expect(game(library, "Hades")).toMatchObject({
      status: "Playing",
      startedAt: T1.toISOString(),
      endedAt: null,
    });
  });

  it("sets the end date when a Game becomes Finished or Dropped", () => {
    let library = libraryOf("Hades", "Celeste");
    library = move(library, "Hades", "Playing", T1);
    library = move(library, "Hades", "Finished", T2);
    library = move(library, "Celeste", "Dropped", T3);

    expect(game(library, "Hades")).toMatchObject({
      startedAt: T1.toISOString(),
      endedAt: T2.toISOString(),
    });
    // Dropped without ever playing: no start date is invented.
    expect(game(library, "Celeste")).toMatchObject({
      startedAt: null,
      endedAt: T3.toISOString(),
    });
  });

  it("keeps the original start date when a Paused Game is resumed", () => {
    let library = libraryOf("Hades");
    library = move(library, "Hades", "Playing", T1);
    library = move(library, "Hades", "Paused", T2);
    library = move(library, "Hades", "Playing", T3);
    expect(game(library, "Hades").startedAt).toBe(T1.toISOString());
  });

  it("clears the end date when a Played Game is picked up again", () => {
    let library = libraryOf("Hades");
    library = move(library, "Hades", "Playing", T1);
    library = move(library, "Hades", "Dropped", T2);
    library = move(library, "Hades", "Playing", T3);
    expect(game(library, "Hades")).toMatchObject({
      startedAt: T1.toISOString(),
      endedAt: null,
    });
  });

  it("clears both dates when a Game goes back to Unplayed", () => {
    let library = libraryOf("Hades");
    library = move(library, "Hades", "Playing", T1);
    library = move(library, "Hades", "Finished", T2);
    library = move(library, "Hades", "Unplayed", T3);
    expect(game(library, "Hades")).toMatchObject({
      startedAt: null,
      endedAt: null,
    });
  });
});

describe("views", () => {
  it("Backlog holds Unplayed and Paused, Current holds Playing, Played holds Finished and Dropped", () => {
    let library = libraryOf("A", "B", "C", "D", "E");
    library = move(library, "B", "Playing", T1);
    library = move(library, "C", "Paused", T1);
    library = move(library, "D", "Finished", T1);
    library = move(library, "E", "Dropped", T1);

    expect(titles(backlog(library))).toEqual(["A", "C"]);
    expect(titles(current(library))).toEqual(["B"]);
    expect(titles(played(library)).sort()).toEqual(["D", "E"]);
  });

  it("sorts Current by start date, oldest first", () => {
    let library = libraryOf("A", "B", "C");
    library = move(library, "B", "Playing", T2);
    library = move(library, "C", "Playing", T1);
    library = move(library, "A", "Playing", T3);
    expect(titles(current(library))).toEqual(["C", "B", "A"]);
  });

  it("sorts Played by end date, newest first", () => {
    let library = libraryOf("A", "B", "C");
    library = move(library, "B", "Finished", T2);
    library = move(library, "C", "Dropped", T1);
    library = move(library, "A", "Finished", T3);
    expect(titles(played(library))).toEqual(["A", "B", "C"]);
  });
});

describe("Current limit", () => {
  it("defaults to 3 and refuses a fourth Game in Current", () => {
    let library = libraryOf("A", "B", "C", "D");
    expect(library.currentLimit).toBe(3);
    library = move(library, "A", "Playing", T1);
    library = move(library, "B", "Playing", T1);
    library = move(library, "C", "Playing", T1);

    const result = setStatus(library, id(library, "D"), "Playing", T2);
    expect(result).toEqual({ ok: false, reason: "currentFull" });
  });

  it("does not count Paused Games", () => {
    let library = libraryOf("A", "B", "C", "D");
    library = move(library, "A", "Playing", T1);
    library = move(library, "B", "Playing", T1);
    library = move(library, "C", "Playing", T1);
    library = move(library, "C", "Paused", T2);
    library = move(library, "D", "Playing", T2);
    expect(titles(current(library))).toEqual(["A", "B", "D"]);
  });

  it("frees a slot when a Game leaves Current", () => {
    let library = libraryOf("A", "B", "C", "D");
    library = move(library, "A", "Playing", T1);
    library = move(library, "B", "Playing", T1);
    library = move(library, "C", "Playing", T1);
    library = move(library, "A", "Finished", T2);
    library = move(library, "D", "Playing", T2);
    expect(titles(current(library))).toContain("D");
  });

  it("can be changed, and a Game moved into a bigger Current is accepted", () => {
    let library = setCurrentLimit(libraryOf("A", "B"), 1);
    library = move(library, "A", "Playing", T1);
    expect(setStatus(library, id(library, "B"), "Playing", T2).ok).toBe(false);

    library = setCurrentLimit(library, 2);
    expect(library.currentLimit).toBe(2);
    expect(setStatus(library, id(library, "B"), "Playing", T2).ok).toBe(true);
  });

  it("lowering the limit below the Current count keeps the Games but refuses new ones", () => {
    let library = libraryOf("A", "B", "C");
    library = move(library, "A", "Playing", T1);
    library = move(library, "B", "Playing", T1);
    library = setCurrentLimit(library, 1);
    expect(titles(current(library))).toEqual(["A", "B"]);
    expect(setStatus(library, id(library, "C"), "Playing", T2).ok).toBe(false);
  });

  it("ignores limits below 1 or non-integers", () => {
    const library = createLibrary();
    expect(setCurrentLimit(library, 0)).toBe(library);
    expect(setCurrentLimit(library, 2.5)).toBe(library);
  });
});

describe("Backlog order", () => {
  it("moves a Game up and down by one place", () => {
    let library = libraryOf("A", "B", "C");
    library = moveUp(library, id(library, "C"));
    expect(titles(backlog(library))).toEqual(["A", "C", "B"]);
    library = moveDown(library, id(library, "A"));
    expect(titles(backlog(library))).toEqual(["C", "A", "B"]);
  });

  it("does nothing at the top or bottom", () => {
    const library = libraryOf("A", "B");
    expect(titles(backlog(moveUp(library, id(library, "A"))))).toEqual([
      "A",
      "B",
    ]);
    expect(titles(backlog(moveDown(library, id(library, "B"))))).toEqual([
      "A",
      "B",
    ]);
  });

  it("only swaps within the Backlog, skipping Games in other views", () => {
    let library = libraryOf("A", "B", "C");
    library = move(library, "B", "Playing", T1);
    library = moveDown(library, id(library, "A"));
    expect(titles(backlog(library))).toEqual(["C", "A"]);
  });

  it("puts a Game that returns to the Backlog on top", () => {
    let library = libraryOf("A", "B", "C");
    library = move(library, "C", "Playing", T1);
    library = move(library, "C", "Paused", T2);
    expect(titles(backlog(library))).toEqual(["C", "A", "B"]);

    library = move(library, "B", "Finished", T2);
    library = move(library, "B", "Unplayed", T3);
    expect(titles(backlog(library))).toEqual(["B", "C", "A"]);
  });

  it("keeps the place when a Game stays in the Backlog", () => {
    let library = libraryOf("A", "B", "C");
    library = move(library, "B", "Paused", T1);
    expect(titles(backlog(library))).toEqual(["A", "B", "C"]);
  });
});

describe("removeGame", () => {
  it("removes only the given Game", () => {
    const library = libraryOf("A", "B");
    expect(titles(removeGame(library, id(library, "A")).games)).toEqual(["B"]);
  });
});

describe("statusTargets", () => {
  it("offers the Statuses a Game can be moved to, never its own", () => {
    expect(statusTargets("Unplayed")).toEqual(["Playing", "Dropped"]);
    expect(statusTargets("Paused")).toEqual(["Playing", "Dropped"]);
    expect(statusTargets("Playing")).toEqual(["Paused", "Finished", "Dropped"]);
    expect(statusTargets("Finished")).toEqual(["Playing", "Unplayed"]);
    expect(statusTargets("Dropped")).toEqual(["Playing", "Unplayed"]);
  });
});
