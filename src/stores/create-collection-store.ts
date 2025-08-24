import { create } from 'zustand';

type CreateCollectionStore = {
  open: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
};
export const useCreateCollectionStore = create<CreateCollectionStore>(
  (set) => ({
    open: false,
    setOpen: (value) => set({ open: value }),
    toggle: () => set((state) => ({ open: !state.open })),
  }),
);
