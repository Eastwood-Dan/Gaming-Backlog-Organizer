# MVP scope

The first release is a cut of the agreed feature set in `features.md`. Terms are defined in `GLOSSARY.md`.

## Goal

The MVP answers "What do I play next?". Done when the owner has entered their Library and uses the app instead of their current system (notes, spreadsheet). Time budget: at most two weeks; anything that threatens it leaves the MVP.

## In the MVP

- **Adding Games**: by hand only. A Game has an optional external ID field (unused for now) so the RAWG search can be added later without a migration. Bulk entry: paste one title per line to create several Games at once.
- **Fields per Game**: title, Status, note, Copies (platform + store, from a list the owner can extend), manual Backlog order. Start and end dates are set automatically on Status changes, because Current and Played are sorted by them.
- **Statuses and views**: the five Statuses and the three views as in `features.md`. Backlog is ordered manually (drag and drop, plus move buttons on touch). Top is next.
- **Current limit**: default 3, adjustable in a setting. The app refuses to move another Game into Current while it is full. `Paused` does not count.
- **Finding Games**: search by title, filter by platform.
- **Sync and login**: Supabase with login (magic link or email/password), see ADR 0002. No social login.
- **Offline**: only the app shell is cached; the last loaded Library is readable offline. Editing requires a connection.
- **Deleting a Game**: confirmation dialog, no trash.
- **Language**: German UI with strings kept out of the code.

## Not in the MVP (later, in roughly this order)

1. RAWG search when adding (cover, genre).
2. Own rating, including the rule that it is required on `Finished`.
3. Metacritic score and HowLongToBeat times, plus the playtime filter.
4. Random suggestion from the Backlog.

Still excluded as in `features.md`: multiple playthroughs, tags, automatic refresh of fetched values, store imports. Offline editing is excluded as well.

## Assumptions to revisit

- The Library starts at roughly 100 Games or fewer, which is why bulk entry is simple paste-a-list and there is no import.
- Own rating is deferred even though `features.md` requires it on `Finished`; until it is built, `Finished` needs no rating.
