'use client';
import { use } from 'react';
import { useTagsPromise } from '../providers/tags-provider';
import { Button } from '../ui/button';

export default function TagsList() {
  const promise = useTagsPromise();
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
          {tag.name.charAt(0).toUpperCase() +
            tag.name.slice(1)}
        </Button>
      ))}
    </>
  );
}
