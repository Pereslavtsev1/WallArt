import { TagListSkeleton } from '@/components/skeletons/tag-list-skeleton';
import { Button } from '@/components/ui/button';
import type { Result } from '@/db';
import type { Tag } from '@/db/schema';
import { Stream, type Streamable } from '../utils/stream';

type TagListProps = {
  className: string;
  tags: Streamable<Result<Tag[]>>;
};

export function TagList({ className, tags }: TagListProps) {
  return (
    <Stream
      value={tags}
      fallback={
        <TagListSkeleton
          className={'flex gap-x-2'}
          skeletonStyles={'h-9 w-44'}
        />
      }
      errorFallback={<div>Error</div>}
    >
      {(data) => {
        if (!data.success) throw new Error(data.error);
        return (
          <ul className={className}>
            {data.data.map((tags) => (
              <li key={tags.id}>
                <Button
                  variant='ghost'
                  className='text-xs font-semibold sm:text-sm'
                >
                  {tags.name}
                </Button>
              </li>
            ))}
          </ul>
        );
      }}
    </Stream>
  );
}
