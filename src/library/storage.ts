import { createLibrary, type Library } from "./library";

/**
 * Where the Library is kept. Async so a remote backend (Supabase, see
 * docs/adr/0002) can replace the local implementation without touching callers.
 */
export interface LibraryStore {
  load(): Promise<Library>;
  save(library: Library): Promise<void>;
}

const STORAGE_KEY = "gaming-organizer.library";

function isLibrary(value: unknown): value is Library {
  if (typeof value !== "object" || value === null) return false;
  const { games, currentLimit } = value as Partial<Library>;
  return Array.isArray(games) && typeof currentLimit === "number";
}

/** Keeps the whole Library as one JSON value in the browser's localStorage. */
export function createLocalStorageStore(): LibraryStore {
  return {
    async load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return createLibrary();
        const parsed: unknown = JSON.parse(raw);
        return isLibrary(parsed) ? parsed : createLibrary();
      } catch {
        return createLibrary();
      }
    },
    async save(library) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    },
  };
}
