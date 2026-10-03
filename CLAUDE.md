# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Gaming-Backlog-Organizer is an app to organize a gaming backlog (see `README.md`). The repository currently contains **no application code, build system, linter, or tests** — only the README and a vendored set of Claude Code skills in `.claude/skills/` (from mattpocock/skills, see `.claude/skills/LICENSE-mattpocock-skills`).

Because nothing exists yet, there are no build/lint/test commands to document. When the tech stack is chosen and scaffolding is added, update this file with those commands (including how to run a single test) and the architecture.

## Repository layout

- `.claude/skills/<name>/SKILL.md` — each directory is one skill; some include supporting docs, scripts, and `agents/openai.yaml` (an OpenAI-agent variant of the same skill). Edit the `SKILL.md`, not the generated-looking `openai.yaml`, unless changing agent metadata.
- Skills relevant to project setup: `setup-matt-pocock-skills` (configures issue tracker, triage labels, and domain-doc layout), `setup-pre-commit` (Husky + lint-staged), `git-guardrails-claude-code` (blocks destructive git commands via hooks), `domain-modeling` (GLOSSARY.md / ADRs).
