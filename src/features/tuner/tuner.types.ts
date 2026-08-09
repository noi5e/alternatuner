import type { EditorScale } from "@/features/scales/scale.types";

type startNoteFunction = (id: string, hertz: number) => void;
type stopNoteFunction = (id: string) => void;

export type ScaleEditorProps = {
  key?: string;
  initialScale: EditorScale;
  onSave(scale: EditorScale): Promise<void>;
};

export type NoteButtonProps = {
  hertz: number;
  label?: string;
  isPlaying: boolean;
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
  playingHertz: Set<number>;
  startNote: startNoteFunction;
  stopNote: stopNoteFunction;
};

// prop for rendering NoteButton component, visible in the UI, with code + label for keyboard events
export type Note = {
  hertz: number;
  code?: string;
  label?: string;
};

// associated with a playable audio object, and its built-in stop function
export type PlayingNote = {
  hertz: number;
  stop: () => void;
};

export type Key = {
  code: string; // for keyPress events, eg. KeyboardEvent.code
  label: string; // for UX display, eg. "a", "b", "c"
};
