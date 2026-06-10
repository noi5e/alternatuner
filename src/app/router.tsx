import { createBrowserRouter } from "react-router";

import { AppLayout } from "./AppLayout.tsx";
import { Tuner } from "../features/tuner/Tuner.tsx";
import { AuthGate } from "../features/auth/AuthGate.tsx";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Tuner /> },
      { path: "/login", element: <AuthGate /> },
    ],
  },
]);
