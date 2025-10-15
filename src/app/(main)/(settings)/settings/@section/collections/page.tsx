import InfinityScrollCollectionList from '@/components/general/collection-list/infinity-scroll-collection-list';
import CollectionHeaderSection from '@/components/general/collections-section/collections-section-header';
import { Card, CardContent } from '@/components/ui/card';
import { findAllCurrentUserCollectionsAction } from '@/server/actions/collection-actions';

async function fetchFunction({ limit, page }: { limit: number; page: number }) {
  return findAllCurrentUserCollectionsAction({
    columns: {
      id: true,
      wallpaperCount: true,
      title: true,
      description: true,
    },
    params: { limit: limit, offset: page * limit },
  });
}
async function loadMore({ limit, page }: { limit: number; page: number }) {
  'use server';
  const res = await fetchFunction({ limit, page });
  if (!res.success) throw new Error(res.error);
  return res.data;
}

export default async function CollectionSection() {
  return (
    <Card className='bg-background'>
      <CollectionHeaderSection />
      <CardContent>
        <InfinityScrollCollectionList
          className='columns-1 gap-x-2 sm:columns-2 md:columns-3'
          props={{
            loadMoreAction: loadMore,
          }}
        />
      </CardContent>
    </Card>
  );
}
