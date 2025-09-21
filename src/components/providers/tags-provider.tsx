'use client';
import {
  createContext,
  type ReactNode,
  useContext,
} from 'react';
import type { Result } from '@/db';
import type { Tag } from '@/db/schema';

const TagsContext = createContext<
  Promise<Result<Tag[]>> | undefined
>(undefined);

export const TagsProvider = ({
  children,
  promise,
}: {
  children: ReactNode;
  promise: Promise<Result<Tag[]>>;
}) => {
  return (
    <TagsContext.Provider value={promise}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsPromise = () => {
  const context = useContext(TagsContext);
  if (!context)
    throw new Error(
      'useTagsPromise must be used within TagsProvider',
    );
  return context;
};
