import { create } from 'zustand';
export const SectionIDs = {
  PROFILE: 'profile',
  SECURITY: 'security',
  COLLECTIONS: 'collections',
  WALLPAPERS: 'wallpapers',
  GENERAL: 'general',
  APPEARANCE: 'appearance',
  FAVORITES: 'favorites',
} as const;

export type SectionID = (typeof SectionIDs)[keyof typeof SectionIDs];

interface SettingsState {
  activeSection: SectionID;
  setActiveSection: (section: SectionID) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeSection: SectionIDs.PROFILE,
  setActiveSection: (section) => set({ activeSection: section }),
}));
