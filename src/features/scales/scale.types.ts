export type ScaleHeaderProps = {
  notesCount: number;
  setScaleTitle: (newTitle: string) => void;
  scaleTitle: string;
  onSave: () => void;
  isSaving: boolean;
};

export type ScaleSideBarProps = {
  scales: SavedScale[];
  isLoading: boolean;
  error: string | null;
};

export type ScaleListErrorProps = {
  message: string;
};

export type CreateScaleNoteInput = {
  hertz: number;
};

export type CreateScaleInput = {
  title: string;
  notes: CreateScaleNoteInput[];
};

export type ScaleNote = {
  id: string;
  scale_id: string;
  position: number;
  hertz: number;
};

export type SavedScale = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};
