import { Editor } from "@/features/editor/Editor";

import { createScale } from "@/features/scales/api";
import { useNavigate } from "react-router";
import type { EditorScale } from "@/features/scales/scale.types";
import { routeSlugTranslator } from "@/lib/routeSlug";

export function NewScalePage() {
  const navigate = useNavigate();

  async function handleCreate(draft: EditorScale) {
    const input = {
      title: draft.title,
      notes: draft.notes.map(({ hertz }) => ({ hertz })),
    };

    const created = await createScale(input);

    // after scale is created, navigate to its dedicated /scales/scaleSlug page, so that onSave becomes updateScale() instead of createScale().
    navigate(`/scales/${routeSlugTranslator.fromUUID(created.id)}`, {
      replace: true,
    });
  }

  return (
    <Editor
      initialScale={{ title: "Untitled Scale", notes: [] }}
      onSave={handleCreate}
    />
  );
}
