import { supabase } from "@/lib/supabase";
import type {
  EditorScale,
  DatabaseScaleRow,
  DatabaseScaleRowWithNotes,
} from "@/features/scales/scale.types";

function stripEditorScaleNotesArray(notes: EditorScale["notes"]): number[] {
  return notes.map(({ hertz }) => hertz);
}

export async function listScales(): Promise<DatabaseScaleRowWithNotes[]> {
  const { data, error } = await supabase
    .from("scales")
    .select("id, title, created_at, updated_at, scale_notes(*)")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getScaleById(
  scaleId: string,
): Promise<DatabaseScaleRowWithNotes> {
  const { data, error } = await supabase
    .from("scales")
    .select("id, title, created_at, updated_at, scale_notes(*)")
    .eq("id", scaleId)
    .single();

  if (error) throw error;
  return data;
}

export async function createScale({
  title = "Untitled Scale",
  notes,
}: EditorScale): Promise<DatabaseScaleRow> {
  const p_notes = stripEditorScaleNotesArray(notes);

  const { data, error } = await supabase
    .rpc("create_scale_with_notes", {
      p_title: title,
      p_notes,
    })
    .single();

  if (error) throw error;
  return data;
}

export async function updateScale(
  id: string,
  { title, notes }: EditorScale,
): Promise<DatabaseScaleRowWithNotes> {
  const { error } = await supabase.rpc("update_scale_with_notes", {
    p_scale_id: id,
    p_title: title,
    p_notes: stripEditorScaleNotesArray(notes),
  });

  if (error) throw error;

  return getScaleById(id);
}

export async function deleteScale(id: string) {
  const { error } = await supabase.from("scales").delete().eq("id", id);
  if (error) throw error;
}
