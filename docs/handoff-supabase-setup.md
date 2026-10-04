# Handoff: Supabase setup and sync (MVP step 3)

Written 2026-10-04 for a fresh Claude Code session on the owner's PC. Delete this file when step 3 is merged.

## State

- `main` has the local game list (PR #6, see `docs/session-logs/2026-10-04-game-list.md`). Storage is behind the async `LibraryStore` interface in `src/library/storage.ts`; only the localStorage implementation exists.
- Branch `claude/game-list-mvp-ti97t5` (from `main`) holds one extra commit: `supabase/schema.sql`. No PR yet. Check out this branch and continue on it.
- Decisions by the owner: email + password login (no magic link: it opens in Safari, not the installed iPad PWA); one row per Game (`games` table plus `settings` with `current_limit`), row level security per user, see `supabase/schema.sql` and `docs/adr/0002-supabase-for-cross-device-sync.md`.
- The owner has no Supabase project yet.

## Part A: set up Supabase (owner's PC, Supabase CLI)

Look up current commands in the Supabase docs; do not rely on memory.

1. Owner has a Supabase account and runs `supabase login` (browser). Prefer this over handing you an access token.
2. Create project `gaming-organizer`, EU region. The owner chooses the database password and keeps it; never write it to the repo.
3. Apply `supabase/schema.sql` (e.g. `supabase db push` or the SQL editor).
4. Turn off public sign-ups (the repo is public). The owner creates their own user (auto-confirmed) in the dashboard; do not ask for or use the `service_role` / secret key.
5. Read the project URL and the publishable (anon) key. Both are public by design.

Ask the owner before changing GitHub repo settings (Actions variables) or deleting anything not created by you.

## Part B: build the sync

- Add `@supabase/supabase-js`. Read URL and key from `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; local values go in an ignored `.env.local`, add a committed `.env.example`. In `.github/workflows/deploy.yml` pass them as repository variables (owner confirms first) so the Pages build has them.
- A `LibraryStore` implementation for Supabase: `load` reads `games` (ordered by `position`) and `settings`; `save` upserts changed Games with `position` = array index, deletes removed ones, upserts the limit. The UI stays as is, except: login screen (email + password, German strings in `src/i18n/de.ts`), logout, and an error message when saving fails.
- First login with an empty cloud Library and data in the browser's localStorage: offer to upload the local Library once (ask, never overwrite silently).
- Offline: only the app shell is cached; the last loaded Library is readable offline, editing needs a connection (`docs/mvp-scope.md`).
- Keep logic tests independent of Supabase; test the store against a fake client at the seam.

## Suggested skills

- `tdd` for the store and any logic (confirm the seams with the owner first).
- `wizard` only if the owner wants a repeatable setup script; the CLI steps above probably make it unnecessary.
- `pr` for the PR body. Then squash-merge, leave only `main` (the owner asked for this last time).

## Working rules (also in `CLAUDE.md`)

- The owner uses the Claude app on an iPad and does not know the technical terms: explain briefly and simply, in German.
- UI text only via `src/i18n/de.ts`; code and identifiers in English with terms from `GLOSSARY.md`.
- Lint, typecheck, test and build must pass. Update `CLAUDE.md` and add a session log in `docs/session-logs/`.
- Tell the owner what to check on the iPad after the deploy.
