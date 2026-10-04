import { statusTargets, type Game, type Status } from "../library/library";
import { t } from "../i18n";

interface Props {
  game: Game;
  /** Present only in the Backlog, where order is manual. */
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSetStatus: (status: Status) => void;
  onDelete: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE");
}

export function GameCard({
  game,
  onMoveUp,
  onMoveDown,
  onSetStatus,
  onDelete,
}: Props) {
  const label = (action: string) =>
    t("action.forGame", { action, title: game.title });

  return (
    <li className="card">
      <h3>{game.title}</h3>
      <p className="meta">
        <span className={`badge ${game.status}`}>
          {t(`status.${game.status}`)}
        </span>
        {game.startedAt && (
          <span>{t("game.started", { date: formatDate(game.startedAt) })}</span>
        )}
        {game.endedAt && (
          <span>{t("game.ended", { date: formatDate(game.endedAt) })}</span>
        )}
      </p>
      <div className="actions">
        {onMoveUp && (
          <button
            type="button"
            aria-label={label(t("game.moveUp"))}
            onClick={onMoveUp}
          >
            ↑ {t("game.moveUp")}
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            aria-label={label(t("game.moveDown"))}
            onClick={onMoveDown}
          >
            ↓ {t("game.moveDown")}
          </button>
        )}
        {statusTargets(game.status).map((status) => (
          <button
            key={status}
            type="button"
            aria-label={label(t(`action.${status}`))}
            onClick={() => onSetStatus(status)}
          >
            {t(`action.${status}`)}
          </button>
        ))}
        <button
          type="button"
          className="danger-text"
          aria-label={label(t("game.delete"))}
          onClick={onDelete}
        >
          {t("game.delete")}
        </button>
      </div>
    </li>
  );
}
