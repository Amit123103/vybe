import { create } from 'zustand';
import { mmkvStorage, STORAGE_KEYS } from '../services/storageService';

interface DraftPost {
  caption: string;
  mediaUris: string[];
  mediaType: 'image' | 'video' | 'text' | 'carousel';
  hashtags: string[];
  location?: string;
  audience: 'public' | 'friends' | 'private';
  savedAt: string;
}

interface DraftState {
  draft: DraftPost | null;

  saveDraft: (draft: DraftPost) => void;
  loadDraft: () => void;
  clearDraft: () => void;
  updateDraft: (updates: Partial<DraftPost>) => void;
}

export const useDraftStore = create<DraftState>((set, get) => ({
  draft: null,

  saveDraft: (draft: DraftPost) => {
    const withTimestamp = { ...draft, savedAt: new Date().toISOString() };
    mmkvStorage.setJSON(STORAGE_KEYS.DRAFT_POST, withTimestamp);
    set({ draft: withTimestamp });
  },

  loadDraft: () => {
    const savedDraft = mmkvStorage.getJSON<DraftPost>(STORAGE_KEYS.DRAFT_POST);
    if (savedDraft) {
      set({ draft: savedDraft });
    }
  },

  clearDraft: () => {
    mmkvStorage.remove(STORAGE_KEYS.DRAFT_POST);
    set({ draft: null });
  },

  updateDraft: (updates: Partial<DraftPost>) => {
    const current = get().draft;
    if (current) {
      const updated = { ...current, ...updates };
      get().saveDraft(updated);
    }
  },
}));
