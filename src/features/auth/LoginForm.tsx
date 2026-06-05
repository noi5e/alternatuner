import { useState, useEffect, useRef } from "react";
import { supabase } from "../../utils/supabase";
import type {
  EmailOtpType,
  // JwtPayload,
  VerifyTokenHashParams,
} from "@supabase/supabase-js";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  // const [claims, setClaims] = useState<JwtPayload | null>(null);
  const hasVerifiedRef = useRef(false);

  // Check URL params on initial render
  const [verifying, setVerifying] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get("token_hash"));
  });

  const [authError, setAuthError] = useState<string | null>(null);
  // const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    // Check if we have token_hash in URL (magic link callback)
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (!token_hash || hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true;

    if (token_hash) {
      // verify OTP token
      supabase.auth
        .verifyOtp({
          token_hash,
          type: (type || "email") as EmailOtpType,
        } as VerifyTokenHashParams)
        .then(({ error }) => {
          if (error) {
            setAuthError(error.message);
          } else {
            // setAuthSuccess(true);
            // clear URL params
            window.history.replaceState({}, document.title, "/");
          }
          setVerifying(false);
        });
    }

    // Check for existing session using getClaims
    // supabase.auth.getClaims().then(({ data }) => {
    //   const claims = data?.claims ?? null;

    //   setClaims(claims);
    // });

    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange(() => {
    //   supabase.auth.getClaims().then(({ data }) => {
    //     const claims = data?.claims ?? null;

    //     setClaims(claims);
    //   });
    // });

    // return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }

    setLoading(false);
  };

  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   setClaims(null);
  // };

  // Show verification state
  if (verifying) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>Confirming your magic link...</p>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth error
  if (authError) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>✗ Authentication failed</p>
        <p>{authError}</p>
        <button
          onClick={() => {
            setAuthError(null);
            window.history.replaceState({}, document.title, "/");
          }}
        >
          Return to login
        </button>
      </div>
    );
  }

  // Show auth success (briefly before claims load)
  // if (authSuccess && !claims) {
  //   return (
  //     <div>
  //       <h1>Authentication</h1>
  //       <p>✓ Authentication successful!</p>
  //       <p>Loading your account...</p>
  //     </div>
  //   );
  // }

  // If user is logged in, show welcome screen
  // if (claims) {
  //   return (
  //     <div>
  //       <h1>Welcome!</h1>
  //       <p>You are logged in as: {claims.email}</p>
  //       <button onClick={handleLogout}>Sign Out</button>
  //     </div>
  //   );
  // }

  return (
    <>
      <h1>Login</h1>
      <p>Enter your email address to sign in:</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? <span>Loading</span> : <span>Send magic link</span>}
        </button>
      </form>
    </>
  );
}
