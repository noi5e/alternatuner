import type { JwtPayload } from "@supabase/supabase-js";

export type Note = {
  hertz: number;
  code?: string;
  label?: string;
};

export type PlayingNote = {
  stop: () => void;
};

type startNoteFunction = (id: string, hertz: number) => void;
type stopNoteFunction = (id: string) => void;

export type NoteButtonProps = {
  hertz: number;
  label?: string;
  onDelete: (hertz: number) => void;
  startNote: startNoteFunction;
  stopNote: stopNoteFunction;
};

export type NoteFormProps = {
  onCreateNote: (formData: FormData) => void;
};

export type NotesListProps = {
  notes: Note[];
  onDelete: (hertz: number) => void;
  startNote: startNoteFunction;
  stopNote: stopNoteFunction;
};

export type Key = {
  code: string; // for keyPress events, eg. KeyboardEvent.code
  label: string; // for UX display, eg. "a", "b", "c"
};

export type AuthContextType = {
  claims: JwtPayload | null;
  loading: boolean;
  signOut: () => Promise<void>;
};
