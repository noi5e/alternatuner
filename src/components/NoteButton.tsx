type NoteButtonProps = {
  hertz: number;
  onPlay: (hertz: number) => void;
  onDelete: (hertz: number) => void;
};

export function NoteButton({ hertz, onPlay, onDelete }: NoteButtonProps) {
  return (
    <>
      <button type="button" onClick={() => onPlay(hertz)}>
        {hertz} Hz
      </button>
      <button type="button" onClick={() => onDelete(hertz)}>
        Delete {hertz}
      </button>
    </>
  );
}
