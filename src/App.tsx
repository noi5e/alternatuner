import { useState } from "react";
import "./App.css";

type Note = {
  hertz: number;
};

const DURATION = 2000; // ms

function NoteButton(note: Note) {
  return <button onClick={() => playNote(note)}>{note.hertz} Hz</button>;
}

function playNote({ hertz }: Note) {
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = hertz;
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioCtx.close();
  }, DURATION);
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

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
        return prev; // no change
      }

      return [...prev, { hertz }];
    });
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
