import type { NotesListProps } from "@/features/tuner/tuner.types";
import { NoteButton } from "@/features/tuner/NoteButton";

export function NotesList({
  notes,
  onDelete,
  playingHertz,
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
          isPlaying={playingHertz.has(note.hertz)}
        />
      ))}
    </div>
  );
}
