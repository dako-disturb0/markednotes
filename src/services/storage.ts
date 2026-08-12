import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';
import { INITIAL_NOTES } from '../constants/theme';

const NOTES_STORAGE_KEY = '@markdown_notes_app_data_v1';

export const StorageService = {
  async getNotes(): Promise<Note[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
      // First time launch: save and return initial notes
      await this.saveNotes(INITIAL_NOTES);
      return INITIAL_NOTES;
    } catch (e) {
      console.error('Failed to load notes from AsyncStorage', e);
      return INITIAL_NOTES;
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save notes to AsyncStorage', e);
    }
  },
};
