'use client';
import { use } from 'react';
import type { Tag } from '@/db/schema';
import { Button } from '../ui/button';

const TagsList = ({ promise }: { promise: Promise<Tag[]> }) => {
  const tags = use(promise);

  return (
    <>
      {tags.map((tag) => (
        <Button
          key={tag.id}
          className='font-semibold justify-start'
          variant={'ghost'}
        >
          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
        </Button>
      ))}
    </>
  );
};

export default TagsList;
