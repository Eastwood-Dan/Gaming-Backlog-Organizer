# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Gaming Organizer (repo directory still `Gaming-Backlog-Organizer`) is an app to organize what the owner plays next, plays now, and has played (see `README.md`). The repository currently contains **no application code, build system, linter, or tests** — only the README and a vendored set of Claude Code skills in `.claude/skills/` (from mattpocock/skills, see `.claude/skills/LICENSE-mattpocock-skills`).

Because nothing exists yet, there are no build/lint/test commands to document. When scaffolding is added, update this file with those commands (including how to run a single test) and the architecture.

### Decided so far

- **Users**: just the owner for now; publishing later is possible.
- **Platform**: a PWA, used on an iPad (installed to the home screen) and a Windows PC. The owner has no Mac, so native iOS is out. See `docs/adr/0001-pwa-instead-of-native-ios.md`.
- **Stack**: TypeScript, React, Vite with a PWA plugin.
- **Backend**: Supabase (free tier, with login) for sync between devices. See `docs/adr/0002-supabase-for-cross-device-sync.md`.
- **Domain model**: one Game per Library entry, with zero or more Copies (platform + store) and one Status. Backlog, Current and Played are the three views of the Library by Status. Terms are defined in `GLOSSARY.md`.
- **Language**: code, identifiers, and `GLOSSARY.md` in English; the UI starts in German, with strings kept out of the code so it can be translated later.

- **Features and MVP**: the agreed feature set is in `docs/features.md`; the MVP cut (manual entry only, Supabase sync, read-only offline, Current limit, title search and platform filter) is in `docs/mvp-scope.md`.

### Still open

Nothing is open at the scope level. Implementation details (data schema, screens, project scaffolding) are decided when building.

## Repository layout

- `.claude/skills/<name>/SKILL.md` — each directory is one skill; some include supporting docs, scripts, and `agents/openai.yaml` (an OpenAI-agent variant of the same skill). Edit the `SKILL.md`, not the generated-looking `openai.yaml`, unless changing agent metadata.
- Skills relevant to project setup: `setup-matt-pocock-skills` (configures issue tracker, triage labels, and domain-doc layout), `setup-pre-commit` (Husky + lint-staged), `git-guardrails-claude-code` (blocks destructive git commands via hooks), `domain-modeling` (GLOSSARY.md / ADRs).

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
