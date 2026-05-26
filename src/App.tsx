import { useState, useRef } from "react";
// import { supabase } from "./utils/supabase";

import "./App.css";

import type { Note } from "./types";
import { playNote } from "./utils/audio";
import { NoteForm } from "./components/NoteForm";
import { NotesList } from "./components/NotesList";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null); // reuse audio context; avoid creating new audioCtx for each note, and allow sustained, overlapping notes

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }

  function handlePlayNote(hertz: number) {
    playNote(getAudioContext(), hertz);
  }

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

      return [...prev, { hertz }].sort((a, b) => a.hertz - b.hertz);
    });
  }

  function deleteNote(hertzToDelete: number) {
    setNotes((prev) => prev.filter((note) => note.hertz !== hertzToDelete));
  }

  return (
    <>
      <NoteForm onCreateNote={createNote} />
      <NotesList notes={notes} onPlay={handlePlayNote} onDelete={deleteNote} />
    </>
  );
}

export default App;
