import { createBrowserRouter } from "react-router-dom";
import { Hacking } from "./views/Hacking";
import { Home } from "./views/Home";
import { NotFound } from "./views/NotFound";
import { RootLayout } from "./views/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "hacking", element: <Hacking /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
