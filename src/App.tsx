import { useEffect, useState } from "react";
import { AddGames } from "./components/AddGames";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { CurrentLimit } from "./components/CurrentLimit";
import { GameCard } from "./components/GameCard";
import { t, type MessageKey } from "./i18n";
import {
  addGames,
  backlog,
  current,
  moveDown,
  moveUp,
  played,
  removeGame,
  setCurrentLimit,
  setStatus,
  type Game,
  type Library,
  type Status,
} from "./library/library";
import { createLocalStorageStore, type LibraryStore } from "./library/storage";

type ViewName = "backlog" | "current" | "played";

const VIEWS: readonly ViewName[] = ["backlog", "current", "played"];

const defaultStore = createLocalStorageStore();

interface Props {
  store?: LibraryStore;
}

function App({ store = defaultStore }: Props) {
  const [library, setLibrary] = useState<Library | null>(null);
  const [activeView, setActiveView] = useState<ViewName>("backlog");
  const [message, setMessage] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Game | null>(null);

  useEffect(() => {
    let cancelled = false;
    void store.load().then((loaded) => {
      if (!cancelled) setLibrary(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  if (library === null) {
    return (
      <main>
        <p>{t("app.loading")}</p>
      </main>
    );
  }

  function update(next: Library) {
    setLibrary(next);
    setMessage(null);
    store.save(next).catch(() => setMessage(t("error.saveFailed")));
  }

  function changeStatus(game: Game, status: Status) {
    const result = setStatus(library!, game.id, status, new Date());
    if (result.ok) {
      update(result.library);
    } else {
      setMessage(
        t("error.currentFull", {
          count: current(library!).length,
          limit: library!.currentLimit,
        })
      );
    }
  }

  const lists: Record<ViewName, Game[]> = {
    backlog: backlog(library),
    current: current(library),
    played: played(library),
  };

  return (
    <main>
      <header className="app-header">
        <h1>{t("app.title")}</h1>
        <CurrentLimit
          limit={library.currentLimit}
          onChange={(limit) => update(setCurrentLimit(library, limit))}
        />
      </header>

      {message && (
        <div className="message" role="alert">
          <span>{message}</span>
          <button
            type="button"
            className="icon"
            aria-label={t("error.dismiss")}
            onClick={() => setMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      <nav className="tabs" aria-label={t("view.nav")}>
        {VIEWS.map((view) => (
          <button
            key={view}
            type="button"
            aria-current={view === activeView ? "page" : undefined}
            onClick={() => setActiveView(view)}
          >
            {t(`view.${view}`)} ({lists[view].length})
          </button>
        ))}
      </nav>

      <div className="views">
        {VIEWS.map((view) => (
          <section
            key={view}
            className="view"
            data-active={view === activeView}
            aria-labelledby={`heading-${view}`}
          >
            <h2 id={`heading-${view}`}>{t(`view.${view}`)}</h2>
            <p className="hint">{t(`view.${view}.hint` as MessageKey)}</p>
            {view === "backlog" && (
              <AddGames onAdd={(titles) => update(addGames(library, titles))} />
            )}
            {lists[view].length === 0 ? (
              <p className="empty">{t(`view.${view}.empty` as MessageKey)}</p>
            ) : (
              <ul>
                {lists[view].map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onMoveUp={
                      view === "backlog"
                        ? () => update(moveUp(library, game.id))
                        : undefined
                    }
                    onMoveDown={
                      view === "backlog"
                        ? () => update(moveDown(library, game.id))
                        : undefined
                    }
                    onSetStatus={(status) => changeStatus(game, status)}
                    onDelete={() => setPendingDelete(game)}
                  />
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          heading={t("delete.heading")}
          body={t("delete.body", { title: pendingDelete.title })}
          confirmLabel={t("delete.confirm")}
          cancelLabel={t("delete.cancel")}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            update(removeGame(library, pendingDelete.id));
            setPendingDelete(null);
          }}
        />
      )}
    </main>
  );
}

export default App;
