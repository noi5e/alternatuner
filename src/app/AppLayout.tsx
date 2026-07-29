import { Outlet } from "react-router";
import { SiteNav } from "./SiteNav";

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
