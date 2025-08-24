import { create } from 'zustand';
export enum SectionIDs {
  PROFILE = 'Profile',
  SECURITY = 'Security',
  GENERAL = 'General',
  APPEARANCE = 'Appearance',
  COLLECTIONS = 'Collections',
  MYWALLPAPER = 'My wallpaper',
}
type SettingsStore = {
  activeSection: SectionIDs;
  setActiveSection: (value: SectionIDs) => void;
};
export const useSettingsStore = create<SettingsStore>((set) => ({
  activeSection: SectionIDs.PROFILE,
  setActiveSection: (value: SectionIDs) => set({ activeSection: value }),
}));
