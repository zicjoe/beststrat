import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { LandingPage } from "./pages/LandingPage";
import { BuilderPage } from "./pages/BuilderPage";
import { ScannerPage } from "./pages/ScannerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: "builder", Component: BuilderPage },
      { path: "scanner", Component: ScannerPage },
    ],
  },
]);
