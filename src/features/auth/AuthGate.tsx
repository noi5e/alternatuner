import { LoginForm } from "./LoginForm";
import { Tuner } from "../tuner/Tuner";

export function AuthGate() {
  const isLoggedIn = true; // replace with Supabase session/claims later

  if (!isLoggedIn) {
    return <LoginForm />;
  } else {
    return <Tuner />;
  }
}
