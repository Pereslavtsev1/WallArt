import type { ReactNode } from 'react';
import CreateCollection from '@/components/general/modals/create-collection';

export default async function CollectionsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <CreateCollection />
    </>
  );
}
