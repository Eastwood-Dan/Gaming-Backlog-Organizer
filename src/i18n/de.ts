export const de = {
  "app.title": "Gaming Organizer",
  "app.loading": "Lädt …",

  "view.backlog": "Backlog",
  "view.current": "Aktuell",
  "view.played": "Gespielt",
  "view.nav": "Ansichten",
  "view.backlog.hint": "Oben ist als Nächstes dran.",
  "view.current.hint": "Nach Startdatum, älteste zuerst.",
  "view.played.hint": "Nach Enddatum, neueste zuerst.",
  "view.backlog.empty": "Noch keine Spiele im Backlog.",
  "view.current.empty": "Gerade spielst du nichts.",
  "view.played.empty": "Noch nichts gespielt.",

  "status.Unplayed": "Ungespielt",
  "status.Paused": "Pausiert",
  "status.Playing": "Wird gespielt",
  "status.Finished": "Durchgespielt",
  "status.Dropped": "Abgebrochen",

  "action.Playing": "Jetzt spielen",
  "action.Paused": "Pausieren",
  "action.Finished": "Durchgespielt",
  "action.Dropped": "Abbrechen",
  "action.Unplayed": "Zurück ins Backlog",
  "action.forGame": "{action}: {title}",
  "game.moveUp": "Nach oben",
  "game.moveDown": "Nach unten",
  "game.delete": "Löschen",
  "game.started": "Gestartet: {date}",
  "game.ended": "Beendet: {date}",

  "add.titleLabel": "Titel des Spiels",
  "add.submit": "Hinzufügen",
  "add.bulkToggle": "Mehrere Titel einfügen",
  "add.bulkLabel": "Ein Titel pro Zeile",
  "add.bulkSubmit": "Alle hinzufügen",
  "add.bulkCancel": "Schließen",

  "limit.label": "Limit für Aktuell",
  "limit.decrease": "Limit senken",
  "limit.increase": "Limit erhöhen",

  "error.currentFull":
    "Aktuell ist voll ({count} von {limit}). Beende, pausiere oder brich ein Spiel ab, oder erhöhe das Limit.",
  "error.saveFailed":
    "Speichern fehlgeschlagen. Die letzte Änderung ist nur vorübergehend sichtbar.",
  "error.dismiss": "Meldung schließen",

  "delete.heading": "Spiel löschen?",
  "delete.body":
    "„{title}“ wird endgültig gelöscht. Willst du es nur nicht mehr spielen, brich es stattdessen ab.",
  "delete.confirm": "Löschen",
  "delete.cancel": "Zurück",
} as const;
