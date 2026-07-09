import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrashIcon } from "@phosphor-icons/react";

import type { NoteButtonProps } from "../types";

export function NoteButton({
  hertz,
  label,
  onPlay,
  onDelete,
}: NoteButtonProps) {
  return (
    <Card
      className="relative h-32 w-28 cursor-pointer rounded-none"
      onClick={() => onPlay(hertz)}
    >
      <CardHeader className="absolute inset-0 p-2 z-10 rounded-none">
        <div className="flex justify-around items-center">
          {label && (
            <Badge className="text-gray-400 cursor-default bg-transparent">
              {label}
            </Badge>
          )}
          <Button
            className="opacity-0 transition-opacity group-hover/card:opacity-100 focus-visible:opacity-100 text-gray-400 cursor-pointer"
            aria-label={`Delete ${hertz} Hz note`}
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(hertz);
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="absolute inset-0 flex items-center justify-center gap-1 p-0">
        <span className="font-extrabold text-2xl">{hertz}</span>
        <span className="text-xs text-gray-400">Hz</span>
      </CardContent>
    </Card>
  );
}
