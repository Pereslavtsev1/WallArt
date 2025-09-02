import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Tag } from '@/db/schema';

export default function WallpaperTags({
  promise,
}: {
  promise: Promise<Tag[]>;
}) {
  const tags = use(promise);

  if (!tags.length) return null;
  return (
    <div className='space-y-3'>
      <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
        Tags
      </h3>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Badge variant='secondary' className='font-semibold' key={tag.id}>
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
