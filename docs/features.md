# Basic features

Agreed feature set of Gaming Organizer. Terms are defined in `GLOSSARY.md`. The MVP scope (what is built first) is decided separately.

## Library and Games

- A Game enters the Library only when the owner adds it deliberately, either by hand or via search in RAWG. Store libraries are never imported automatically.
- On adding, the app fetches the Metacritic score (from RAWG) and the three HowLongToBeat times (Main Story, Main + Extras, Completionist) once. HowLongToBeat has no official API, so this uses an unofficial scraper that may break. Every fetched value can be entered or overwritten by hand, and the app works without the scraper.
- Per Game: title, cover, genre, Metacritic score, the three HowLongToBeat times (all shown), note, own rating.
- Copies are platform + store, chosen from a list the owner can extend. A Game may have zero Copies (wanted but not owned yet).
- Deleting a Game is only for mistaken entries: confirmation dialog, no trash. `Dropped` is the way to say "I no longer want to play this".

## Status and views

- Five Statuses: `Unplayed`, `Paused`, `Playing`, `Finished`, `Dropped`. One Status per Game; no multiple playthroughs.
- **Backlog** (`Unplayed`, `Paused`): ordered manually by drag and drop. Top is next. There is no separate priority field.
- **Current** (`Playing`): bounded by the **Current limit** (default 3, adjustable). When full, the app refuses to move another Game in. `Paused` does not count towards the limit. Sorted by start date, oldest first.
- **Played** (`Finished`, `Dropped`): sorted by end date, newest first.
- Start and end dates are set automatically on Status changes.
- Own rating is required when a Game becomes `Finished`, optional for `Dropped` (a short reason can go in the note).
- Layout: three columns on PC and iPad landscape, tabs on narrow screens. Touch devices also get buttons for moving Games, since drag and drop between columns is fiddly.

## Finding Games

- Filter by platform and playtime, search by title.
- Optional random suggestion from the Backlog.

## Offline

- The Library can be read offline (cache). Editing requires a connection.

## Explicitly not planned for now

- Multiple playthroughs per Game.
- Tags.
- Automatic refresh of fetched values.
- Store imports.
