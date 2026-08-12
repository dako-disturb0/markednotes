import { useState, useEffect, useCallback, useMemo } from 'react';
import { Note, NoteCategory, SortOption } from '../types/note';
import { StorageService } from '../services/storage';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Load notes on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const loaded = await StorageService.getNotes();
      setNotes(loaded);
      setLoading(false);
    };
    loadData();
  }, []);

  // Helper to persist notes state
  const updateNotesState = useCallback((newNotes: Note[]) => {
    setNotes(newNotes);
    StorageService.saveNotes(newNotes);
  }, []);

  // Create Note
  const addNote = useCallback(
    (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
      const now = new Date().toISOString();
      const newNote: Note = {
        ...noteData,
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: now,
        updatedAt: now,
      };
      const updated = [newNote, ...notes];
      updateNotesState(updated);
      return newNote;
    },
    [notes, updateNotesState]
  );

  // Update Note
  const updateNote = useCallback(
    (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
      const updated = notes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      });
      updateNotesState(updated);
    },
    [notes, updateNotesState]
  );

  // Delete Note
  const deleteNote = useCallback(
    (id: string) => {
      const updated = notes.filter((note) => note.id !== id);
      updateNotesState(updated);
    },
    [notes, updateNotesState]
  );

  // Toggle Pin
  const togglePin = useCallback(
    (id: string) => {
      const updated = notes.map((note) => {
        if (note.id === id) {
          return { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() };
        }
        return note;
      });
      updateNotesState(updated);
    },
    [notes, updateNotesState]
  );

  // Toggle Favorite
  const toggleFavorite = useCallback(
    (id: string) => {
      const updated = notes.map((note) => {
        if (note.id === id) {
          return { ...note, isFavorite: !note.isFavorite };
        }
        return note;
      });
      updateNotesState(updated);
    },
    [notes, updateNotesState]
  );

  // Duplicate Note
  const duplicateNote = useCallback(
    (id: string) => {
      const target = notes.find((n) => n.id === id);
      if (!target) return;
      const now = new Date().toISOString();
      const duplicate: Note = {
        ...target,
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        title: `${target.title} (Salinan)`,
        createdAt: now,
        updatedAt: now,
        isPinned: false,
      };
      const updated = [duplicate, ...notes];
      updateNotesState(updated);
    },
    [notes, updateNotesState]
  );

  // Filtered & Sorted Notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Category filter
        if (selectedCategory !== 'All' && note.category !== selectedCategory) {
          return false;
        }
        // Favorite filter
        if (onlyFavorites && !note.isFavorite) {
          return false;
        }
        // Search filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const titleMatch = note.title.toLowerCase().includes(q);
          const contentMatch = note.content.toLowerCase().includes(q);
          const tagMatch = note.tags.some((t) => t.toLowerCase().includes(q));
          return titleMatch || contentMatch || tagMatch;
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned notes always come first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Default updatedAt
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, selectedCategory, onlyFavorites, searchQuery, sortBy]);

  return {
    notes: filteredNotes,
    allNotesCount: notes.length,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    onlyFavorites,
    setOnlyFavorites,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
    duplicateNote,
  };
};
