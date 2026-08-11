import { useState, useEffect } from "react";
import { Outlet } from "react-router";

import { ScaleSideBar } from "@/features/scales/ScaleSideBar";

import { useAuthClaims } from "@/features/auth/useAuthClaims";
import { listScales } from "@/features/scales/api";

import type {
  DatabaseScaleRowWithNotes,
  SideBarScale,
} from "@/features/scales/scale.types";

function getSideBarScales(
  databaseRows: DatabaseScaleRowWithNotes[],
): SideBarScale[] {
  return databaseRows.map((row) => ({
    id: row.id,
    title: row.title,
    noteCount: row.scale_notes.length,
  }));
}

export function ScalesLayout() {
  const { claims, loading } = useAuthClaims();
  const isSideBarVisible = !loading && Boolean(claims);

  const [userScales, setUserScales] = useState<DatabaseScaleRowWithNotes[]>([]);
  const [scalesLoading, setScalesLoading] = useState(true);
  const [scalesError, setScalesError] = useState<string | null>(null);

  // fetch user's scales from database, and list them in ScaleSideBar.
  useEffect(() => {
    if (loading || !claims) {
      setUserScales([]);
      return;
    }

    async function fetchScales() {
      let scales;

      try {
        setScalesLoading(true);
        setScalesError(null);
        scales = await listScales();
        setUserScales(scales);
      } catch (error) {
        console.error("Error fetching scales:", error);

        setScalesError(
          error instanceof Error ? error.message : "Failed to fetch scales",
        );
      } finally {
        setScalesLoading(false);
      }
    }

    fetchScales();
  }, [claims, loading]);

  return (
    <div className="grid min-h-[calc(100vh-var(--nav-height))] grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)]">
      {isSideBarVisible && (
        <ScaleSideBar
          userScales={getSideBarScales(userScales)}
          isLoading={scalesLoading}
          error={scalesError}
        />
      )}
      <Outlet />
    </div>
  );
}
