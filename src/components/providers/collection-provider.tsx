'use client';
import { createContext, type ReactNode, useContext } from 'react';
import type { Collection } from '@/db/schema';

const CollectionContext = createContext<Promise<Collection[]> | undefined>(undefined);

export const CollectionProvider = ({
  children,
  promise,
}: {
  children: ReactNode;
  promise: Promise<Collection[]>;
}) => {
  return <CollectionContext.Provider value={promise}>{children}</CollectionContext.Provider>;
};

export const useCollectionPromise = () => {
  const context = useContext(CollectionContext);
  if (!context) throw new Error('useCollectionPromise must be used within CollectionProvider');
  return context;
};
