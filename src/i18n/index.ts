import { de } from "./de";

export type MessageKey = keyof typeof de;

// German is the only locale for now. To add another, introduce a locale
// switch here; callers only ever use t().
const messages: Record<MessageKey, string> = de;

export function t(key: MessageKey): string {
  return messages[key];
}
