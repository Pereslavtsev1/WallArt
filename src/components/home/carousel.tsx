'use client';
import gsap from 'gsap';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const Carousel = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const checkEdges = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setAtStart(scrollLeft <= 0);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkEdges();
  }, [checkEdges]);

  return (
    <div className='relative'>
      {!atStart && (
        <div className='pointer-events-none absolute top-0 left-0 z-10 h-full w-12 bg-gradient-to-r from-background' />
      )}

      {!atEnd && (
        <div className='pointer-events-none absolute top-0 right-0 z-10 h-full w-12 bg-gradient-to-l from-background' />
      )}

      <div
        ref={containerRef}
        onWheel={handleWheel}
        className={cn(
          'cursor-pointer overflow-x-auto overflow-y-hidden overscroll-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Carousel;
