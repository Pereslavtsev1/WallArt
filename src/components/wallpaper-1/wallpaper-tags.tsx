import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Result } from '@/db';
import type { Tag } from '@/db/schema';

export default function WallpaperTags({
  promise,
}: {
  promise: Promise<Result<Tag[]>>;
}) {
  const res = use(promise);
  if (!res.success) throw new Error(res.error);
  const tags = res.data;

  return (
    <>
      {tags.map((tag) => (
        <Badge
          variant='secondary'
          className='px-3 py-1 font-semibold'
          key={tag.id}
        >
          {tag.name}
        </Badge>
      ))}
    </>
  );
}
