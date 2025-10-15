import { ImagesIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import type { Collection } from '@/db/schema';

export type CollectionCardProps = Pick<
  Collection,
  'id' | 'title' | 'description' | 'wallpaperCount'
>;

const CollectionCard = (collection: CollectionCardProps) => {
  return (
    <Card className='mb-4 break-inside-avoid rounded-2xl border bg-border/10 p-2 shadow-md'>
      <CardContent className='min-h-40 rounded-2xl bg-background'>
        <div className='mt-4 flex size-10 items-center justify-center rounded-full bg-muted'>
          <ImagesIcon className='size-5' />
        </div>
        <CardTitle className='mt-4 truncate text-xl font-bold'>
          {collection.title}
        </CardTitle>
        <CardDescription className='mt-2 line-clamp-2 text-xs font-semibold'>
          {collection.description}{' '}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
