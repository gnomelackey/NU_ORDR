import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./views/RootLayout";
import { Home } from "./views/Home";
import { Hacking } from "./views/Hacking";
import { Codex } from "./views/Codex";
import { NotFound } from "./views/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "hacking", element: <Hacking /> },
      { path: "codex", element: <Codex /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
