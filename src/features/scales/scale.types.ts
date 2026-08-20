import type { deleteScaleFunction } from "@/features/editor/editor.types";

export type ScaleHeaderProps = {
  notesCount: number;
  setScaleTitle: (newTitle: string) => void;
  scaleTitle: string;
  onSave: () => void;
  onDelete?: deleteScaleFunction;
  isSaving: boolean;
};

export type ScaleSideBarProps = {
  userScales: SideBarScale[];
  isLoading: boolean;
  error: string | null;
};

export type ScaleListErrorProps = {
  message: string;
};

export type EditorScaleNote = {
  hertz: number;
};

// a scale that is editable/visible in UI, also used to create audio objects for playback.
export type EditorScale = {
  title: string;
  notes: EditorScaleNote[];
};

// link to user's individual scale in sidebar
export type SideBarScale = {
  id: string;
  title: string;
  noteCount: number;
};

export type ScalesOutletContext = {
  // define type to avoid redundant type casting in child components, which depend on refreshScales() passed to them through Outlet context.
  refreshScales: () => Promise<void>; // thin wrapper of React Router's useOutletContext() hook
};

// single row from scale_notes table, with foreign key scale_id to scales table
export type DatabaseScaleNoteRow = {
  id: string;
  scale_id: string;
  position: number;
  hertz: number;
};

// single row from scales table, without its associated scale_notes
export type DatabaseScaleRow = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

// single row from scales table WITH its associated scale_notes
export type DatabaseScaleRowWithNotes = DatabaseScaleRow & {
  scale_notes: DatabaseScaleNoteRow[];
};
