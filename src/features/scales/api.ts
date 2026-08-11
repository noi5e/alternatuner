import { supabase } from "@/lib/supabase";
import type {
  EditorScale,
  DatabaseScaleRow,
  DatabaseScaleRowWithNotes,
} from "@/features/scales/scale.types";

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
  const { data: scale, error: scaleError } = await supabase
    .from("scales")
    .insert({ title: title.trim() || "Untitled Scale" })
    .select("id, title, created_at, updated_at")
    .single();

  if (scaleError) throw scaleError;

  // An empty scale doesn't require a scale_notes insert.
  if (notes.length === 0) {
    return scale;
  }

  // Attach every note to the newly created scale.
  const noteRows = notes.map((note, position) => ({
    scale_id: scale.id,
    hertz: note.hertz,
    position,
  }));

  const { error: notesError } = await supabase
    .from("scale_notes")
    .insert(noteRows);
  if (notesError) throw notesError;

  return scale;
}

export async function updateScale(id: string, { title, notes }: EditorScale) {
  const normalizedTitle = title.trim() || "Untitled Scale";

  // Update the parent scale row.
  const { error: scaleError } = await supabase
    .from("scales")
    .update({
      title: normalizedTitle,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (scaleError) throw scaleError;

  // Remove the scale's previous note set.
  const { error: deleteNotesError } = await supabase
    .from("scale_notes")
    .delete()
    .eq("scale_id", id);

  if (deleteNotesError) throw deleteNotesError;

  // An empty array means the scale should now have no notes.
  if (notes.length > 0) {
    const noteRows = notes.map(({ hertz }, position) => ({
      scale_id: id,
      hertz,
      position,
    }));

    const { error: insertNotesError } = await supabase
      .from("scale_notes")
      .insert(noteRows);

    if (insertNotesError) throw insertNotesError;
  }

  // Return the scale with its updated notes.
  return getScaleById(id);
}

export async function deleteScale(id: string) {
  const { error } = await supabase.from("scales").delete().eq("id", id);
  if (error) throw error;
}
