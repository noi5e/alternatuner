import { Link } from "react-router";

import { routeSlugTranslator } from "@/lib/routeSlug";

import { PlusIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

import type { ScaleSideBarProps, ScaleListErrorProps } from "./scale.types";

export function ScaleSideBar({ scales, isLoading, error }: ScaleSideBarProps) {
  return (
    <aside className="hidden border-r bg-muted/30 lg:flex h-[calc(100vh-var(--nav-height))] flex-col p-4 sticky top-(--nav-height) ">
      <header className="mb-4">
        <h2 className="text-md font-medium tracking-tight">My Scales</h2>
      </header>
      <nav
        className="min-h-0 flex-1 overflow-y-auto"
        aria-label="Scale Navigation"
      >
        {isLoading ? (
          <ScaleListSkeleton />
        ) : error ? (
          <ScaleListError message={error} />
        ) : scales.length === 0 ? (
          <ScaleListEmpty />
        ) : (
          <ul className="space-y-1">
            {scales.map((scale) => {
              return (
                <li key={scale.id}>
                  <Link
                    to={`/scales/${routeSlugTranslator.fromUUID(scale.id)}`}
                  >
                    {scale.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <footer className="p-4">
        <Button className="mt-4 w-full justify-start" variant="outline">
          <PlusIcon className="size-4" />
          New Scale
        </Button>
      </footer>
    </aside>
  );
}

function ScaleListSkeleton() {
  return (
    <div className="space-y-2 px-2" aria-label="Loading scales">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-8 animate-pulse rounded-md bg-muted" />
      ))}
    </div>
  );
}

function ScaleListEmpty() {
  return (
    <p className="px-3 py-6 text-center text-sm text-muted-foreground">
      No saved scales yet.
    </p>
  );
}

function ScaleListError({ message }: ScaleListErrorProps) {
  return (
    <div role="alert" className="space-y-3 px-3 py-4">
      <div className="flex gap-2 text-sm text-destructive">
        <WarningCircleIcon className="mt-0.5 size-4 shrink-0" />
        <p>{message}</p>
      </div>
    </div>
  );
}
