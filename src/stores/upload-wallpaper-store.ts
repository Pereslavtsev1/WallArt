import { create } from 'zustand';

type UploadWallpaperStore = {
  open: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
};

export const useUploadWallpaperStore = create<UploadWallpaperStore>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
  toggle: () => set((state) => ({ open: !state.open })),
}));
