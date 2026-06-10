import { Outlet } from "react-router";
import { SiteNav } from "../components/SiteNav";

export function AppLayout() {
  return (
    <>
      <SiteNav />
      <main>
        <Outlet />
      </main>
    </>
  );
}
