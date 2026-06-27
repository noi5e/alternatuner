type NoteButtonProps = {
  hertz: number;
  label?: string;
  onPlay: (hertz: number) => void;
  onDelete: (hertz: number) => void;
};

export function NoteButton({
  hertz,
  label,
  onPlay,
  onDelete,
}: NoteButtonProps) {
  return (
    <>
      <button type="button" onClick={() => onPlay(hertz)}>
        {hertz} Hz . {label ? `(${label})` : ""}
      </button>
      <button type="button" onClick={() => onDelete(hertz)}>
        Delete {hertz}
      </button>
    </>
  );
}
