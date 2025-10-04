import { create } from 'zustand';

type CreateWallpaperStore = {
  open: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
};

export const useCreateWallpaperStore = create<CreateWallpaperStore>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
  toggle: () => set((state) => ({ open: !state.open })),
}));
