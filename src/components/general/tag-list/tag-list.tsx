import { Button } from '@/components/ui/button';
import type { Result } from '@/db';
import type { Tag } from '@/db/schema';
import { Stream, type Streamable } from '../utils/stream';

type TagListProps = {
  className: string;
  tags: Streamable<Result<Tag[]>>;
};

const TagList = ({ className, tags }: TagListProps) => {
  return (
    <Stream
      value={tags}
      fallback={<div>Loading...</div>}
      errorFallback={<div>Error</div>}
    >
      {(data) => {
        if (!data.success) throw new Error(data.error);
        return (
          <ul className={className}>
            {data.data.map((tags) => (
              <li key={tags.id}>
                <Button variant='ghost' className='font-semibold'>
                  {tags.name}
                </Button>
              </li>
            ))}
          </ul>
        );
      }}
    </Stream>
  );
};

export default TagList;
