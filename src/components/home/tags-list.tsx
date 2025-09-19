'use client';
import { use } from 'react';
import type { Result } from '@/db';
import type { Tag } from '@/db/schema';
import { Button } from '../ui/button';

export default function TagsList({
  promise,
}: {
  promise: Promise<Result<Tag[]>>;
}) {
  const data = use(promise);
  if (!data.success) {
    console.log('here');
    console.error(data.error);
    throw new Error(data.error);
  }
  const tags = data.data;

  return (
    <>
      {tags.map((tag) => (
        <Button
          key={tag.id}
          className='justify-start font-semibold'
          variant={'ghost'}
        >
          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
        </Button>
      ))}
    </>
  );
}
