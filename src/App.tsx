import { useState, useRef } from "react";
import "./App.css";

type Note = {
  hertz: number;
};

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null); // reuse audio context; avoid creating new audioCtx for each note, and allow sustained, overlapping notes

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }

  function NoteButton({ hertz }: Note) {
    return (
      <>
        <button type="button" onClick={() => playNote(hertz)}>
          {hertz} Hz
        </button>
        <button type="button" onClick={() => deleteNote(hertz)}>
          Delete {hertz}
        </button>
      </>
    );
  }

  function playNote(hertz: number) {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator(); // creates an OscillatorNode which represents a periodic waveform, or constant tone
    const gainNode = audioContext.createGain(); // creates a GainNode, which controls the overall volume of the note

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(hertz, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;
    const duration = 1.5; // seconds
    const volume = 0.15;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.setValueAtTime(volume, now + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
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
      <form action={createNote}>
        <input name="hertz" type="number" />
        <button type="submit">Create Note</button>
      </form>
      <>
        {notes.map((note, i) => (
          <NoteButton key={i} {...note} />
        ))}
      </>
    </>
  );
}

export default App;
