import { create } from 'zustand';
import type { Collection } from '@/db/schema';

type CollectionStore = {
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  removeCollection: (id: string) => void;
};

export const useCollectionsStore = create<CollectionStore>((set) => ({
  collections: [],
  setCollections: (collections) => set({ collections }),
  addCollection: (collection) =>
    set((state) => ({ collections: [...state.collections, collection] })),
  removeCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
    })),
}));
