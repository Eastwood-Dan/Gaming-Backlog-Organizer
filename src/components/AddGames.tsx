import { useState, type FormEvent } from "react";
import { parseTitles } from "../library/library";
import { t } from "../i18n";

interface Props {
  onAdd: (titles: string[]) => void;
}

export function AddGames({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  function submitSingle(event: FormEvent) {
    event.preventDefault();
    const titles = parseTitles(title);
    if (titles.length === 0) return;
    onAdd(titles);
    setTitle("");
  }

  function submitBulk(event: FormEvent) {
    event.preventDefault();
    const titles = parseTitles(bulkText);
    if (titles.length === 0) return;
    onAdd(titles);
    setBulkText("");
    setBulkOpen(false);
  }

  return (
    <div className="add-games">
      <form className="row" onSubmit={submitSingle}>
        <input
          type="text"
          aria-label={t("add.titleLabel")}
          placeholder={t("add.titleLabel")}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit" className="primary">
          {t("add.submit")}
        </button>
      </form>

      {bulkOpen ? (
        <form className="bulk" onSubmit={submitBulk}>
          <label>
            {t("add.bulkLabel")}
            <textarea
              rows={6}
              value={bulkText}
              onChange={(event) => setBulkText(event.target.value)}
            />
          </label>
          <div className="row">
            <button type="submit" className="primary">
              {t("add.bulkSubmit")}
            </button>
            <button type="button" onClick={() => setBulkOpen(false)}>
              {t("add.bulkCancel")}
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setBulkOpen(true)}>
          {t("add.bulkToggle")}
        </button>
      )}
    </div>
  );
}
