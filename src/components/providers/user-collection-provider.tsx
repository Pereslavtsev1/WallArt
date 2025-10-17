'use client';
import { createContext, type ReactNode, useContext } from 'react';
import {
  type UseInfinityScrollReturn,
  useInfinityScroll,
} from '@/hooks/use-infinity-scroll';
import { findAllCurrentUserCollectionsAction } from '@/server/actions/collection-actions';
import type { CollectionCardProps } from '../general/collection-list/collection-card';

type UserCollectionsContextProps = {} & UseInfinityScrollReturn<
  CollectionCardProps[]
>;

const UserCollectionsContext = createContext<
  UserCollectionsContextProps | undefined
>(undefined);

export const UserCollectionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const value = useInfinityScroll<CollectionCardProps[]>({
    loadMoreAction: async ({ page, limit }) => {
      const res = await findAllCurrentUserCollectionsAction({
        columns: {
          id: true,
          wallpaperCount: true,
          title: true,
          description: true,
        },
        params: { limit: limit, offset: page * limit },
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  return (
    <UserCollectionsContext.Provider value={value}>
      {children}
    </UserCollectionsContext.Provider>
  );
};

export const useUserCollections = () => {
  const context = useContext(UserCollectionsContext);
  if (!context) {
    throw new Error(
      'useUserCollections must be used within a UserCollectionsProvider',
    );
  }
  return context;
};
