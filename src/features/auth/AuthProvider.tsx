import type { ReactNode } from "react";

import { supabase } from "@/utils/supabase";
import { useAuthClaims } from "./useAuthClaims";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { claims, loading } = useAuthClaims();

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ claims, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
