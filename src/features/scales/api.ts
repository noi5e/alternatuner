import { supabase } from "@/lib/supabase";
import type {
  CreateScaleInput,
  SavedScale,
} from "@/features/scales/scale.types";

export async function listScales() {
  const { data, error } = await supabase
    .from("scales")
    .select("id, title, created_at, updated_at, scale_notes(*)")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createScale({
  title = "Untitled Scale",
  notes,
}: CreateScaleInput): Promise<SavedScale> {
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

export async function updateScale(id: string, changes: { title?: string }) {
  const { data, error } = await supabase
    .from("scales")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteScale(id: string) {
  const { error } = await supabase.from("scales").delete().eq("id", id);
  if (error) throw error;
}
