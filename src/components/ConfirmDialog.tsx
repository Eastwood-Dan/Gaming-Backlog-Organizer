import { useEffect, useRef } from "react";

interface Props {
  heading: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  heading,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Start on the harmless button so a stray tap cannot delete anything.
  useEffect(() => cancelRef.current?.focus(), []);

  return (
    <div className="backdrop" onClick={onCancel}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-heading"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.key === "Escape" && onCancel()}
      >
        <h2 id="dialog-heading">{heading}</h2>
        <p>{body}</p>
        <div className="dialog-actions">
          <button ref={cancelRef} type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
