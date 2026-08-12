export type NoteCategory = 'Personal' | 'Work' | 'Ideas' | 'Study' | 'Journal' | 'Code';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  color?: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface NoteTemplate {
  id: string;
  title: string;
  category: NoteCategory;
  description: string;
  content: string;
  icon: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'updatedAt' | 'createdAt' | 'title';
