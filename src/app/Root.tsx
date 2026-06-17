import { Outlet, useLocation } from "react-router";
import { AppHeader } from "./components/AppHeader";

export function Root() {
  const location = useLocation();
  const isBuilder = location.pathname === "/builder";
  const isScanner = location.pathname === "/scanner";

  return (
    <div className="min-h-screen" style={{ background: "#0B0E11", color: "#fff" }}>
      <AppHeader isBuilder={isBuilder} isScanner={isScanner} />
      <Outlet />
    </div>
  );
}
