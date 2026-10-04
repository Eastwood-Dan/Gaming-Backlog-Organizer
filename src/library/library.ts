// Pure Library logic: no React, no storage, no clock. Terms follow GLOSSARY.md.
// Functions never mutate; they return a new Library.

export const STATUSES = [
  "Unplayed",
  "Paused",
  "Playing",
  "Finished",
  "Dropped",
] as const;

export type Status = (typeof STATUSES)[number];

export interface Game {
  id: string;
  title: string;
  status: Status;
  /** ISO timestamp; set when the Game first becomes Playing. */
  startedAt: string | null;
  /** ISO timestamp; set when the Game becomes Finished or Dropped. */
  endedAt: string | null;
}

export interface Library {
  /** Array order is the manual Backlog order (top is next). */
  games: Game[];
  currentLimit: number;
}

export const DEFAULT_CURRENT_LIMIT = 3;

export function createLibrary(): Library {
  return { games: [], currentLimit: DEFAULT_CURRENT_LIMIT };
}

export function parseTitles(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

const BACKLOG_STATUSES: readonly Status[] = ["Unplayed", "Paused"];

function isInBacklog(game: Game): boolean {
  return BACKLOG_STATUSES.includes(game.status);
}

export function backlog(library: Library): Game[] {
  return library.games.filter(isInBacklog);
}

export function addGames(
  library: Library,
  titles: string[],
  createId: () => string = () => crypto.randomUUID()
): Library {
  const added: Game[] = titles
    .map((title) => title.trim())
    .filter((title) => title !== "")
    .map((title) => ({
      id: createId(),
      title,
      status: "Unplayed",
      startedAt: null,
      endedAt: null,
    }));
  return { ...library, games: [...library.games, ...added] };
}

export type SetStatusResult =
  { ok: true; library: Library } | { ok: false; reason: "currentFull" };

function datesFor(game: Game, status: Status, now: Date) {
  const iso = now.toISOString();
  switch (status) {
    case "Unplayed":
      return { startedAt: null, endedAt: null };
    case "Paused":
      return { startedAt: game.startedAt, endedAt: null };
    case "Playing":
      return { startedAt: game.startedAt ?? iso, endedAt: null };
    case "Finished":
    case "Dropped":
      return { startedAt: game.startedAt, endedAt: iso };
  }
}

export function setStatus(
  library: Library,
  gameId: string,
  status: Status,
  now: Date
): SetStatusResult {
  const game = library.games.find((g) => g.id === gameId);
  if (
    status === "Playing" &&
    game?.status !== "Playing" &&
    current(library).length >= library.currentLimit
  ) {
    return { ok: false, reason: "currentFull" };
  }
  const updated = library.games.map((g) =>
    g.id === gameId ? { ...g, status, ...datesFor(g, status, now) } : g
  );
  const wasInBacklog = game !== undefined && isInBacklog(game);
  const games =
    BACKLOG_STATUSES.includes(status) && !wasInBacklog
      ? moveToBacklogTop(updated, gameId)
      : updated;
  return { ok: true, library: { ...library, games } };
}

export function current(library: Library): Game[] {
  return library.games
    .filter((game) => game.status === "Playing")
    .sort((a, b) => (a.startedAt ?? "").localeCompare(b.startedAt ?? ""));
}

export function played(library: Library): Game[] {
  return library.games
    .filter((game) => game.status === "Finished" || game.status === "Dropped")
    .sort((a, b) => (b.endedAt ?? "").localeCompare(a.endedAt ?? ""));
}

export function setCurrentLimit(library: Library, limit: number): Library {
  if (!Number.isInteger(limit) || limit < 1) return library;
  return { ...library, currentLimit: limit };
}

function moveToBacklogTop(games: Game[], gameId: string): Game[] {
  const moved = games.find((g) => g.id === gameId);
  if (!moved) return games;
  const rest = games.filter((g) => g.id !== gameId);
  const firstBacklog = rest.findIndex(isInBacklog);
  const at = firstBacklog === -1 ? 0 : firstBacklog;
  return [...rest.slice(0, at), moved, ...rest.slice(at)];
}

function swapInBacklog(
  library: Library,
  gameId: string,
  direction: -1 | 1
): Library {
  const inBacklog = backlog(library);
  const from = inBacklog.findIndex((g) => g.id === gameId);
  const neighbour = inBacklog[from + direction];
  if (from === -1 || !neighbour) return library;
  const a = library.games.findIndex((g) => g.id === gameId);
  const b = library.games.findIndex((g) => g.id === neighbour.id);
  const games = [...library.games];
  [games[a], games[b]] = [games[b], games[a]];
  return { ...library, games };
}

export function moveUp(library: Library, gameId: string): Library {
  return swapInBacklog(library, gameId, -1);
}

export function moveDown(library: Library, gameId: string): Library {
  return swapInBacklog(library, gameId, 1);
}

export function removeGame(library: Library, gameId: string): Library {
  return { ...library, games: library.games.filter((g) => g.id !== gameId) };
}

const STATUS_TARGETS: Record<Status, readonly Status[]> = {
  Unplayed: ["Playing", "Dropped"],
  Paused: ["Playing", "Dropped"],
  Playing: ["Paused", "Finished", "Dropped"],
  Finished: ["Playing", "Unplayed"],
  Dropped: ["Playing", "Unplayed"],
};

/** The Statuses the UI offers as move buttons for a Game in the given Status. */
export function statusTargets(status: Status): readonly Status[] {
  return STATUS_TARGETS[status];
}
