type NoteFormProps = {
  onCreateNote: (formData: FormData) => void;
};

export function NoteForm({ onCreateNote }: NoteFormProps) {
  return (
    <form action={onCreateNote}>
      <input name="hertz" type="number" />
      <button type="submit">Create Note</button>
    </form>
  );
}
