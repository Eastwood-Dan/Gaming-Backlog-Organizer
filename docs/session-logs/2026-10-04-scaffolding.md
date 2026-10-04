# Session log: project scaffolding and first deploy

Date: 2026-10-03/04. Result: scaffolding is complete and in `main`; the app is live on GitHub Pages and installed on the iPad.

## What was done

1. **Scaffold** (PR #3): official `npm create vite` (React + TypeScript), `vite-plugin-pwa` (manifest, service worker, placeholder icons), German UI strings in `src/i18n/de.ts` read via `t(key)`, ESLint, Prettier, Vitest with one example test, Husky + lint-staged via the `setup-pre-commit` skill. `CLAUDE.md` now lists commands (including running a single test) and the architecture.
2. **Deploy** (PR #4): `.github/workflows/deploy.yml` runs lint, typecheck, test and build on every push to `main` and deploys to GitHub Pages. `vite.config.ts` reads `BASE_PATH` because Pages serves under `/Gaming-Backlog-Organizer/`.
3. **Verified**: lint, typecheck, test, build and the dev server ran locally; the Pages workflow succeeded; the owner confirmed the start page on the iPad and added it to the home screen.

## Decisions and deviations

- The Vite template ships oxlint; replaced by ESLint as requested.
- Vite was run in a scratch folder and copied in, because the repo root already held `.claude/` and `docs/` and the command would prompt or overwrite. Same output.
- `README.md` is excluded from Prettier to leave it untouched.
- Hosting: the repo was private, so GitHub Pages was not free. The owner chose to make the repo public and use GitHub Pages. Consequence: code, docs and commit author email are publicly visible.
- Both PRs were squash-merged; the remote branches were deleted automatically.

## State of `main`

`374ab66` (PR #4) on top of `17137a0` (PR #3). No Supabase, no domain code.

## Open

- (Done in this PR) `CLAUDE.md` now documents the Pages deployment and `BASE_PATH`.
- PWA icons are solid-colour placeholders.
- Offline behaviour and installability were only checked via the home-screen start, not in airplane mode.

## Next

Game list with the three views (Backlog, Current, Played) and move buttons, stored locally first; Supabase sync afterwards. Open questions to the owner: first version scope, local storage first, look and feel.
