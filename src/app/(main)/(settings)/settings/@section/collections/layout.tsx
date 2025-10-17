import type { ReactNode } from 'react';
import CreateCollection from '@/components/general/modals/create-collection';
import { UserCollectionsProvider } from '@/components/providers/user-collection-provider';

export default async function CollectionsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <UserCollectionsProvider>
      {children}
      <CreateCollection />
    </UserCollectionsProvider>
  );
}
