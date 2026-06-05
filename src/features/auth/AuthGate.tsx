import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../../utils/supabase";

import { LoginForm } from "./LoginForm";
import { Tuner } from "../tuner/Tuner";

export function AuthGate() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on initial render
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error(error);
      }

      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <LoginForm />;
  } else {
    return <Tuner />;
  }
}
