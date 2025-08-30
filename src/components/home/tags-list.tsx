'use client';
import type { Tag } from '@/db/schema';
import gsap from 'gsap';
import { use, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

const TagsCarousel = ({ promise }: { promise: Promise<Tag[]> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tags = use(promise);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    gsap.to(containerRef.current, {
      scrollLeft: containerRef.current.scrollLeft + e.deltaY * 2,
      duration: 0.3,
      ease: 'power1.out',
      onUpdate: checkEdges,
    });
  };

  const checkEdges = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setAtStart(scrollLeft <= 0);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    checkEdges();
  }, []);

  return (
    <div className='relative'>
      {!atStart && (
        <div className='pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-background z-10' />
      )}

      {!atEnd && (
        <div className='pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background z-10' />
      )}

      <div
        ref={containerRef}
        onWheel={handleWheel}
        className='overflow-x-auto overscroll-contain overflow-y-hidden flex gap-x-2 py-4 cursor-pointer scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
      >
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
      </div>
    </div>
  );
};

export default TagsCarousel;
