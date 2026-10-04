# Handover: Prompt für Claude Code am PC

Diesen Prompt in Claude Code am PC einfügen (Repo geöffnet, Branch `claude/game-list-mvp-ti97t5` ausgecheckt). Datei nach Abschluss von Schritt 3 löschen, zusammen mit `docs/handoff-supabase-setup.md`.

## Vorbereitung am PC

```text
git fetch origin
git checkout claude/game-list-mvp-ti97t5
git pull
npm ci
```

## Prompt

```text
Wir machen mit der Implementierung von Gaming Organizer weiter: Schritt 3 des MVP, Supabase-Sync mit Login. Die lokale Spieleliste ist fertig und in main (PR #6).

Lies zuerst docs/handoff-supabase-setup.md (dort stehen Stand, Entscheidungen und Aufgaben), dann CLAUDE.md, GLOSSARY.md, docs/mvp-scope.md, docs/adr/0002-supabase-for-cross-device-sync.md, supabase/schema.sql und docs/session-logs/2026-10-04-game-list.md.

Ich nutze sonst die Claude App auf dem iPad und kenne mich technisch nicht aus. Erkläre Begriffe kurz und einfach, auf Deutsch.

Aufgabe:
- Teil A: Supabase einrichten, soweit du es mit der Supabase CLI selbst kannst (Projekt anlegen, supabase/schema.sql einspielen, Registrierung ausschalten). Schlage die genauen Befehle vor und prüfe sie in der aktuellen Supabase-Doku, bevor du sie ausführst. Die Anmeldung (supabase login), mein Datenbank-Passwort und meinen Nutzer lege ich selbst an. Bitte mich nie um den secret key oder service_role key und nutze ihn nicht.
- Teil B: Sync bauen wie in der Handoff-Datei beschrieben: Login (E-Mail + Passwort), Supabase-Umsetzung der LibraryStore-Schnittstelle, einmaliges Hochladen der lokalen Liste, Fehlermeldung beim Speichern. Alle UI-Texte kommen aus src/i18n/de.ts, Code und Bezeichner sind Englisch mit den Begriffen aus GLOSSARY.md.

Vorgehen:
- Nutze den Skill tdd für den Speicher (Seams vorher mit mir abstimmen). Die Logik bleibt unabhängig von Supabase testbar.
- Arbeite auf dem ausgecheckten Branch. Lint, Typecheck, Test und Build müssen vor dem PR laufen.
- PR-Body mit dem Skill pr. Am Ende PR erstellen und per Squash mergen, danach darf nur noch main existieren, keine offenen Branches.
- Aktualisiere CLAUDE.md und füge ein Session-Log in docs/session-logs/ hinzu. Lösche am Ende docs/handoff-supabase-setup.md und docs/handover.md.
- Frag nach, bevor du etwas Unumkehrbares tust (z. B. GitHub-Einstellungen oder Actions-Variablen ändern, etwas löschen, das nicht von dir stammt, einen Access Token verwenden).
- Ich teste nach dem Deploy auf dem iPad. Sag mir, was ich dort prüfen soll.
```
