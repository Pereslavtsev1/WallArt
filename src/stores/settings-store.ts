import { create } from 'zustand';
export const SectionIDs = {
  PROFILE: 'profile',
  COLLECTIONS: 'collections',
  SECURITY: 'security',
  WALLPAPERS: 'wallpapers',
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
