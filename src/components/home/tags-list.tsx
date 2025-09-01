'use client';
import type { Tag } from '@/db/schema';
import gsap from 'gsap';
import { use, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

const TagsList = ({ promise }: { promise: Promise<Tag[]> }) => {
  const tags = use(promise);

  return (
    <>
      {/* TODO: Change tags in db              */}
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
