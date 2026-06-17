import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabase";
import type {
  EmailOtpType,
  VerifyTokenHashParams,
} from "@supabase/supabase-js";

import { useAuthClaims } from "./useAuthClaims";

export function LoginForm() {
  const [sendingLink, setSendingLink] = useState(false);
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const { claims, loading } = useAuthClaims();

  // Check URL params on initial render
  const [verifyingMagicLink, setVerifyingMagicLink] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get("token_hash"));
  });

  const hasVerifiedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have token_hash in URL (magic link callback)
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    // hasVerified guards against double verifyOtp calls in React Strict Mode (dev only)
    if (!token_hash || hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true;

    async function verifyMagicLink() {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token_hash,
        type: (type || "email") as EmailOtpType,
      } as VerifyTokenHashParams);

      if (error) {
        setAuthError(error.message);
        setVerifyingMagicLink(false);
        return;
      }

      navigate("/", { replace: true });
    }

    verifyMagicLink();
  }, [navigate]);

  useEffect(() => {
    if (!loading && claims && !verifyingMagicLink) {
      navigate("/", { replace: true });
    }
  }, [verifyingMagicLink, navigate, claims, loading]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sendingLink) return;

    setSendingLink(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/login",
      },
    });

    if (error) {
      setAuthError(error.message);
    }

    setSendingLink(false);
  }

  // Show verification state
  if (verifyingMagicLink) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>Confirming your magic link...</p>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <h1>Login</h1>
      <p>Enter your email address to sign in:</p>

      {authError && <p>✗ {authError}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
        />

        <button type="submit" disabled={sendingLink || !email}>
          {sendingLink ? "Sending..." : "Send magic link"}{" "}
          {/* TO DO: add linkSent state to keep button disabled while waiting for user to confirm magic link, otherwise button reenables itself after Supabase Auth sends email, and user can spam the button*/}
        </button>
      </form>
    </>
  );
}
