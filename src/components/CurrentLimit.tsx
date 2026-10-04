import { t } from "../i18n";

interface Props {
  limit: number;
  onChange: (limit: number) => void;
}

export function CurrentLimit({ limit, onChange }: Props) {
  return (
    <div className="limit" role="group" aria-label={t("limit.label")}>
      <span>{t("limit.label")}</span>
      <button
        type="button"
        className="icon"
        aria-label={t("limit.decrease")}
        disabled={limit <= 1}
        onClick={() => onChange(limit - 1)}
      >
        −
      </button>
      <output>{limit}</output>
      <button
        type="button"
        className="icon"
        aria-label={t("limit.increase")}
        onClick={() => onChange(limit + 1)}
      >
        +
      </button>
    </div>
  );
}
