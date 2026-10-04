import { beforeEach, describe, expect, it } from "vitest";
import { addGames, createLibrary, setCurrentLimit } from "./library";
import { createLocalStorageStore } from "./storage";

beforeEach(() => localStorage.clear());

describe("local storage LibraryStore", () => {
  it("loads an empty Library when nothing was saved", async () => {
    expect(await createLocalStorageStore().load()).toEqual(createLibrary());
  });

  it("returns what was saved, also from a new store instance", async () => {
    const library = setCurrentLimit(
      addGames(createLibrary(), ["Hades", "Celeste"], () =>
        crypto.randomUUID()
      ),
      5
    );
    await createLocalStorageStore().save(library);
    expect(await createLocalStorageStore().load()).toEqual(library);
  });

  it("falls back to an empty Library when the stored data is unreadable", async () => {
    localStorage.setItem("gaming-organizer.library", "{not json");
    expect(await createLocalStorageStore().load()).toEqual(createLibrary());

    localStorage.setItem("gaming-organizer.library", '{"games":"nope"}');
    expect(await createLocalStorageStore().load()).toEqual(createLibrary());
  });
});
