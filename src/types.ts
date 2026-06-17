import type { JwtPayload } from "@supabase/supabase-js";

export type Note = {
  hertz: number;
};

export type AuthContextType = {
  claims: JwtPayload | null;
  loading: boolean;
  signOut: () => Promise<void>;
};
