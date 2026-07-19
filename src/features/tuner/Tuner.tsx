import { useState, useRef, useEffect, useCallback } from "react";

import type { Note, PlayingNote } from "../../types";

import { ScaleHeader } from "./ScaleHeader";
import { NoteForm } from "../../components/NoteForm";
import { NotesList } from "../../components/NotesList";

import { getPlayingNote } from "../../utils/audio";
import { getKeyboardRange } from "../../utils/keyBindings";
import { SideBar } from "#components/SideBar";

const MIN_HIGHLIGHT_MS = 100; // minimum time to highlight a NoteButton after stopNote() is called, to ensure that short pointer taps are visually registered in the UI.

// sort keys by hertz, assign keyDown codes so they're playable via keyboard
function getPlayableNotes(notes: Note[]) {
  const sortedNotes = [...notes].sort((a, b) => a.hertz - b.hertz);

  const keys = getKeyboardRange(sortedNotes.length);
  if (keys.length !== sortedNotes.length)
    throw new Error("Keyboard range does not match note count.");

  return sortedNotes.map((note, i) => ({ ...note, ...keys[i] }));
}

export function Tuner() {
  const [notes, setNotes] = useState<Note[]>([]); // notes that user enters/deletes, visible in UI
  const [playingHertz, setPlayingHertz] = useState<Set<number>>(new Set()); // set of hertz values, sync'ed with  playingNotes, used to highlight actively playing notes in UI.

  const playingNotes = useRef<Map<string, PlayingNote>>(new Map()); // live PlayingNote objects, with built-in stop functions, that user is currently playing via keyboard, or pointer (mouse or touch). key is either "keyboard:${event.code}" or "pointer:${pointerId}"
  const audioContextRef = useRef<AudioContext | null>(null); // reuse audio context; avoid creating new audioCtx for each note, and allow sustained, overlapping notes

  const getAudioContext = useCallback(() => {
    // reuse audioContext if one currently exists, otherwise create a new one.
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const syncPlayingHertz = useCallback(() => {
    setPlayingHertz(
      new Set(Array.from(playingNotes.current.values(), ({ hertz }) => hertz)),
    );
  }, []);

  const startNote = useCallback(
    (id: string, hertz: number) => {
      playingNotes.current.get(id)?.stop(); // stop any existing note keyed to id before starting new one
      const playingNote = getPlayingNote(getAudioContext(), hertz);
      playingNotes.current.set(id, playingNote);
      syncPlayingHertz();
    },
    [getAudioContext, syncPlayingHertz],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return; // ignore repeated keydown events if user holds down key

      const target = event.target as HTMLElement | null;

      if (
        // don't trigger for keydown in input fields, textareas, or contentEditable elements
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const note = notes.find((note) => note.code === event.code); // check to see if key that's pressed corresponds to a note in set

      if (!note) return;

      event.preventDefault(); // prevent default browser behavior for keydown events that correspond to notes
      startNote(`keyboard:${event.code}`, note.hertz);
    },
    [notes, startNote],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const stopNote = useCallback(async (id: string) => {
    // don't trigger if there are no playingNotes tied to this eventCode or pointerId.
    const playingNote = playingNotes.current.get(id);
    if (!playingNote) return;

    // remove any audio objects so that a new audio object with this same input can safely be created, without wating for previous one to finish playing
    playingNotes.current.delete(id);

    playingNote.stop(); // immediately stop the the audio output...

    // ... but delay any visual UI changes, otherwise NoteButton doesn't register a highlight on short pointer taps, due to being too short for React framerate.
    await new Promise((resolve) => {
      window.setTimeout(resolve, MIN_HIGHLIGHT_MS);
    });

    const frequencyStillPlaying = Array.from(
      playingNotes.current.values(),
    ).some((note) => note.hertz === playingNote.hertz);

    if (!frequencyStillPlaying) {
      setPlayingHertz((previous) => {
        const next = new Set(previous);
        next.delete(playingNote.hertz);
        return next;
      });
    }
  }, []);

  const stopAllNotes = useCallback(() => {
    playingNotes.current.forEach((playingNote) => playingNote.stop());
    playingNotes.current.clear();
    setPlayingHertz(new Set());
  }, []);

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (playingNotes.current.has(`keyboard:${event.code}`)) {
        event.preventDefault();
        stopNote(`keyboard:${event.code}`);
      }
    },
    [stopNote],
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  useEffect(() => {
    return () => {
      stopAllNotes();
    };
  }, [stopAllNotes]);

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

    if (notes.some((note) => note.hertz === hertz)) {
      return; // allow only unique notes
    }

    stopAllNotes();

    setNotes((prev) => {
      return getPlayableNotes([...prev, { hertz }]);
    });
  }

  function deleteNote(hertzToDelete: number) {
    stopAllNotes(); // prevents stuck playingNotes if user simultaneously holds a note, and deletes it or another note.

    setNotes((prev) =>
      getPlayableNotes(prev.filter((note) => note.hertz !== hertzToDelete)),
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-var(--nav-height))] grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <SideBar />
      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <ScaleHeader notesCount={notes.length} />
        <NoteForm onCreateNote={createNote} />
        <NotesList
          notes={notes}
          onDelete={deleteNote}
          playingHertz={playingHertz}
          startNote={startNote}
          stopNote={stopNote}
        />
      </main>
    </div>
  );
}
