import { CollectionProvider } from '@/components/providers/collection-provider';
import { TagsProvider } from '@/components/providers/tags-provider';
import { findAllCollectionsByUserIdWithCountAction } from '@/server/actions/collection-actions';
import { findAllTagsAction } from '@/server/actions/tag-actions';

export default async function ({ children }: { children: React.ReactNode }) {
  const tagsPromise = findAllTagsAction();
  const collectionPromise = findAllCollectionsByUserIdWithCountAction();
  return (
    <CollectionProvider promise={collectionPromise}>
      <TagsProvider promise={tagsPromise}>
        <main className='mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8'>
          {children}
        </main>
      </TagsProvider>
    </CollectionProvider>
  );
}
