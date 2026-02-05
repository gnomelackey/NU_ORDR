import { createBrowserRouter } from "react-router-dom";
import { Hacking } from "./views/Hacking";
import { Home } from "./views/Home";
import { NotFound } from "./views/NotFound";
import { PursuitSimulator } from "./views/PursuitSimulator/PursuitSimulator";
import { RootLayout } from "./views/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "hacking", element: <Hacking /> },
      { path: "pursuit-simulator", element: <PursuitSimulator /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
