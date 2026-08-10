import { useLoaderData } from "react-router";

import { Editor } from "@/features/editor/Editor";
import { updateScale } from "@/features/scales/api.ts";
import type { DatabaseScaleRowWithNotes } from "@/features/scales/scale.types";
import type { EditorScale } from "@/features/scales/scale.types";

function getEditableScale(
  scale: DatabaseScaleRowWithNotes,
): EditorScale["notes"] {
  return [...scale.scale_notes]
    .sort((a, b) => a.position - b.position)
    .map(({ hertz }) => ({ hertz }));
}

export function ScalePage() {
  const { scale } = useLoaderData() as { scale: DatabaseScaleRowWithNotes };

  async function handleUpdate(draft: EditorScale) {
    await updateScale(scale.id, draft);
  }

  return (
    <Editor
      key={scale.id}
      initialScale={{ title: scale.title, notes: getEditableScale(scale) }}
      onSave={handleUpdate}
    />
  );
}
