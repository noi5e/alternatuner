import type { NotesListProps } from "../types";
import { NoteButton } from "./NoteButton";

export function NotesList({
  notes,
  onDelete,
  startNote,
  stopNote,
}: NotesListProps) {
  return (
    <div className="flex flex-wrap gap-2 my-8">
      {notes.map((note) => (
        <NoteButton
          key={note.hertz}
          hertz={note.hertz}
          label={note.label}
          onDelete={onDelete}
          startNote={startNote}
          stopNote={stopNote}
        />
      ))}
    </div>
  );
}
