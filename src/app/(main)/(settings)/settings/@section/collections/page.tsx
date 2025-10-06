import InfinityScrollCollectionList from '@/components/general/collection-list/infinity-scroll-collection-list';
import CollectionHeaderSection from '@/components/general/collections-section/collections-section-header';
import { Stream } from '@/components/general/utils/stream';
import CollectionListSkeleton from '@/components/skeletons/collection-list-skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { findAllCurrentUserCollectionsAction } from '@/server/actions/collection-actions';

const LIMIT = 10;

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
        <Stream
          value={fetchFunction({ limit: LIMIT, page: 0 })}
          fallback={<CollectionListSkeleton className='columns-2' />}
          errorFallback={undefined}
        >
          {(res) => {
            if (!res.success) throw new Error(res.error);
            const collections = res.data;
            return (
              <InfinityScrollCollectionList
                initialItems={collections}
                className='columns-2'
                limit={LIMIT}
                initialHasMore={collections.length === LIMIT}
                loadMoreAction={loadMore}
              />
            );
          }}
        </Stream>
      </CardContent>
    </Card>
  );
}
