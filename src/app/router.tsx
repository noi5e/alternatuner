import { createBrowserRouter } from "react-router";

import { getScaleById } from "@/features/scales/api";

import { AppLayout } from "@/app/AppLayout.tsx";
import { Tuner } from "@/features/tuner/Tuner.tsx";
import { LoginForm } from "@/features/auth/LoginForm.tsx";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Tuner /> },
      { path: "/login", element: <LoginForm /> },
      {
        path: "/scales/:scaleId",
        element: <Tuner />,
        loader: async ({ params }) => {
          const scale = await getScaleById(params.scaleId as string);
          return { scale };
        },
      },
    ],
  },
]);
