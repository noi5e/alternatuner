import { createBrowserRouter } from "react-router";

import App from "./App.tsx";
import { LoginForm } from "../features/auth/LoginForm.tsx";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginForm /> },
]);
