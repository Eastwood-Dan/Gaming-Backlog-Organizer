import { de } from "./de";

export type MessageKey = keyof typeof de;

// German is the only locale for now. To add another, introduce a locale
// switch here; callers only ever use t().
const messages: Record<MessageKey, string> = de;

/** Looks up a UI string; `{name}` placeholders are filled from `params`. */
export function t(
  key: MessageKey,
  params: Record<string, string | number> = {}
): string {
  return messages[key].replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}
