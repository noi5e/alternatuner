import type { Note } from "../types";
import { NoteButton } from "./NoteButton";

type NotesListProps = {
  notes: Note[];
  onPlay: (hertz: number) => void;
  onDelete: (hertz: number) => void;
};

export function NotesList({ notes, onPlay, onDelete }: NotesListProps) {
  return (
    <>
      {notes.map((note) => (
        <NoteButton
          key={note.hertz}
          hertz={note.hertz}
          onPlay={onPlay}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
