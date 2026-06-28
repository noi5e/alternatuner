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
    <Card className="w-fit rounded-sm" onClick={() => onPlay(hertz)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          {label && (
            <Badge className="text-gray-400" variant="ghost">
              {label}
            </Badge>
          )}
          <Button
            className="text-gray-400"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(hertz)}
          >
            <TrashIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-1">
        <span className="font-extrabold text-2xl">{hertz}</span>
        <span className="text-xs text-gray-400">Hz</span>
      </CardContent>
    </Card>
  );
}
