import type { JwtPayload } from "@supabase/supabase-js";

export type Note = {
  hertz: number;
  code?: string;
  label?: string;
};

export type Key = {
  code: string; // for keyPress events, eg. KeyboardEvent.code
  label: string; // for UX display, eg. "a", "b", "c"
};

export type AuthContextType = {
  claims: JwtPayload | null;
  loading: boolean;
  signOut: () => Promise<void>;
};
