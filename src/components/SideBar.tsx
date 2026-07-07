import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";

const scales = [
  { id: "harmonic", name: "Harmonic" },
  { id: "dreamy-minor", name: "Dreamy Minor" },
  { id: "just-scale", name: "Just Scale" },
];

export function SideBar() {
  return (
    <aside className="hidden border-r bg-muted/30 lg:flex h-[calc(100vh-var(--nav-height))] flex-col p-4 sticky top-(--nav-height) ">
      <div className="mb-4">
        <h2 className="text-md font-medium tracking-tight">My Scales</h2>
      </div>

      <nav className="flex-1" aria-label="Scale navigation">
        <ul className="space-y-1">
          {scales.map((scale) => (
            <li key={scale.id}>{scale.name}</li>
          ))}
        </ul>
      </nav>

      <Button className="mt-4 w-full justify-start" variant="outline">
        <PlusIcon className="size-4" />
        New Scale
      </Button>
    </aside>
  );
}
