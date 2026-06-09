import { Outlet, useLocation } from "react-router";
import { AppHeader } from "./components/AppHeader";

export function Root() {
  const location = useLocation();
  const isBuilder = location.pathname === "/builder";

  return (
    <div className="min-h-screen" style={{ background: "#0B0E11", color: "#fff" }}>
      <AppHeader isBuilder={isBuilder} />
      <Outlet />
    </div>
  );
}
