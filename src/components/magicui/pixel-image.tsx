'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type Grid = {
  rows: number;
  cols: number;
};

const DEFAULT_GRIDS: Record<string, Grid> = {
  '6x4': { rows: 4, cols: 6 },
  '8x8': { rows: 8, cols: 8 },
  '8x3': { rows: 3, cols: 8 },
  '4x6': { rows: 6, cols: 4 },
  '3x8': { rows: 8, cols: 3 },
};

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

interface PixelImageProps {
  src: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number; // in ms
  maxAnimationDelay?: number; // in ms
  colorRevealDelay?: number; // in ms
  className?: string;
}

export const PixelImage = ({
  src,
  grid = '6x4',
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
  className,
}: PixelImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [pixelDelays, setPixelDelays] = useState<number[]>([]);

  const MIN_GRID = 1;
  const MAX_GRID = 16;

  const { rows, cols } = useMemo<Grid>(() => {
    const isValidGrid = (g: Grid | undefined): g is Grid => {
      if (!g) return false;
      const { rows: r, cols: c } = g;
      return (
        Number.isInteger(r) &&
        Number.isInteger(c) &&
        r >= MIN_GRID &&
        c >= MIN_GRID &&
        r <= MAX_GRID &&
        c <= MAX_GRID
      );
    };

    if (isValidGrid(customGrid)) {
      return customGrid;
    }
    return DEFAULT_GRIDS[grid];
  }, [customGrid, grid]);

  useEffect(() => {
    // Generate random delays only on the client after mount
    const total = rows * cols;
    const delays = Array.from(
      { length: total },
      () => Math.random() * maxAnimationDelay,
    );
    setPixelDelays(delays);

    setIsVisible(true);
    const colorTimeout = setTimeout(() => {
      setShowColor(true);
    }, colorRevealDelay);
    return () => clearTimeout(colorTimeout);
  }, [colorRevealDelay, rows, cols, maxAnimationDelay]);

  const pieces = useMemo(() => {
    const total = rows * cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const clipPath = `polygon(
        ${col * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%,
        ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%
      )`;

      return {
        row,
        col,
        clipPath,
      };
    });
  }, [rows, cols]);
  return (
    <>
      {pieces.map((piece, index) => (
        <div
          key={`${piece.row}-${piece.col}`}
          className={cn(
            'absolute inset-0 transition-all ease-out',
            isVisible ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            clipPath: !showColor ? piece.clipPath : '',
            transitionDelay: `${pixelDelays[index] || 0}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        >
          <Image
            src={src}
            alt={''}
            fill
            className={cn(
              `select-none object-cover`,
              grayscaleAnimation && (showColor ? 'grayscale-0' : 'grayscale'),
              className,
            )}
            style={{
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : 'none',
            }}
          />
        </div>
      ))}
    </>
  );
};
