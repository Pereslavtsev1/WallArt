import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Tag } from '@/db/schema';

export default function WallpaperTags({ promise }: { promise: Promise<Tag[]> }) {
  const tags = use(promise);

  if (!tags.length) return null;
  return (
    <>
      {tags.map((tag) => (
        <Badge variant='secondary' className='px-3 py-1 font-semibold' key={tag.id}>
          {tag.name}
        </Badge>
      ))}
    </>
  );
}
