import { useContext } from 'react';
import { CreateCollectionContext } from '@/components/providers/create-collection-provider';

export function useCreateCollection() {
  const context = useContext(CreateCollectionContext);

  if (context === undefined) {
    throw new Error(
      'useCreateCollection must be used within a create-collection-provider',
    );
  }

  return context;
}
