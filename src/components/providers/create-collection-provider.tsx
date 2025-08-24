'use client';
import { createContext, type ReactNode, useState } from 'react';

type CreateCollectionStore = {
  open: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
};

export const CreateCollectionContext = createContext<
  CreateCollectionStore | undefined
>(undefined);

const CreateCollectionProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const value: CreateCollectionStore = {
    open: open,
    setOpen: setOpen,
    toggle: () => setOpen((prev) => !prev),
  };

  return (
    <CreateCollectionContext.Provider value={value}>
      {children}
    </CreateCollectionContext.Provider>
  );
};

export default CreateCollectionProvider;
