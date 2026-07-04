import { useState, useRef, useEffect, useCallback } from "react";

import type { Note } from "../../types";

import { ScaleHeader } from "./ScaleHeader";
import { NoteForm } from "../../components/NoteForm";
import { NotesList } from "../../components/NotesList";

import { playNote } from "../../utils/audio";
import { getKeyboardRange } from "../../utils/keyBindings";

// sort keys by hertz, assign keyDown codes so they're playable via keyboard
function getPlayableNotes(notes: Note[]) {
  const sortedNotes = [...notes].sort((a, b) => a.hertz - b.hertz);

  const keys = getKeyboardRange(sortedNotes.length);
  if (keys.length !== sortedNotes.length)
    throw new Error("Keyboard range does not match note count.");

  return sortedNotes.map((note, i) => ({ ...note, ...keys[i] }));
}

export function Tuner() {
  const [notes, setNotes] = useState<Note[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null); // reuse audio context; avoid creating new audioCtx for each note, and allow sustained, overlapping notes

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const handlePlayNote = useCallback(
    (hertz: number) => {
      playNote(getAudioContext(), hertz);
    },
    [getAudioContext],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      if (
        // don't trigger for keydown in input fields, textareas, or contentEditable elements
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const note = notes.find((note) => note.code === event.code);

      if (!note) return;

      event.preventDefault(); // prevent default browser behavior for keydown events that correspond to notes
      handlePlayNote(note.hertz);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [notes, handlePlayNote]);

  // get user input, create NoteButton component in UI
  function createNote(formData: FormData) {
    const raw = formData.get("hertz");

    if (typeof raw !== "string") {
      console.error("Invalid input");
      return;
    }

    const hertz = Number(raw);

    if (Number.isNaN(hertz)) {
      console.error("Hertz must be a number");
      return;
    }

    setNotes((prev) => {
      if (prev.some((note) => note.hertz === hertz)) {
        return prev; // allow only unique notes
      }

      return getPlayableNotes([...prev, { hertz }]);
    });
  }

  function deleteNote(hertzToDelete: number) {
    setNotes((prev) =>
      getPlayableNotes(prev.filter((note) => note.hertz !== hertzToDelete)),
    );
  }

  return (
    <div>
      <ScaleHeader />
      <NoteForm onCreateNote={createNote} />
      <NotesList notes={notes} onPlay={handlePlayNote} onDelete={deleteNote} />
    </div>
  );
}
