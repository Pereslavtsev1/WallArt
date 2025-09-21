import Image from 'next/image';
import type { ReactNode } from 'react';
import { PixelImage } from '../magicui/pixel-image';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from '../ui/card';

type WallpaperCardProps = {
  children?: ReactNode;
  className?: string;
};
export const WallpaperCard = ({
  className,
  children,
  ...props
}: WallpaperCardProps & React.ComponentProps<'div'>) => {
  return (
    <Card
      className={`group ${className} relative mb-2 overflow-hidden border-none bg-background p-0 ring-1 ring-background transition-all duration-300`}
      {...props}
    >
      {children}
    </Card>
  );
};

type WallpaperCardContentProps = {
  children?: ReactNode;
  className?: string;
};
export const WallpaperCardContent = ({
  className,
  children,
}: WallpaperCardContentProps) => {
  return <CardContent className={`${className} p-0`}>{children}</CardContent>;
};

type WallpaperCardImageProps = {
  height: number;
  width: number;
  className?: string;
  src: string;
  alt: string;
  usePixelImage?: boolean;
};
export const WallpaperCardImage = ({
  className,
  width,
  height,
  src,
  alt,
  usePixelImage = false,
}: WallpaperCardImageProps) => {
  return usePixelImage ? (
    <div style={{ aspectRatio: width / height }}>
      <PixelImage
        src={src}
        alt={alt}
        className={`${className} rounded-2xl object-cover`}
        grayscaleAnimation={false}
      />
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={`${className} rounded-2xl object-cover`}
    />
  );
};

type WallpaperCardActionsProps = {
  children?: ReactNode;
  className?: string;
};
export const WallpaperCardActions = ({
  className,
  children,
}: WallpaperCardActionsProps) => {
  return (
    <CardAction className={`${className} flex gap-x-2`}>{children}</CardAction>
  );
};

type WallpaperCardFooterProps = {
  children?: ReactNode;
  className?: string;
};
export const WallpaperCardFoooter = ({
  className,
  children,
}: WallpaperCardFooterProps) => {
  return <CardFooter className={className}>{children}</CardFooter>;
};

type WallpaperCardHeaderProps = {
  children?: ReactNode;
  className?: string;
};
export const WallpaperCardHeader = ({
  className,
  children,
}: WallpaperCardHeaderProps) => {
  return (
    <CardHeader className={`${className} flex items-center justify-between`}>
      {children}
    </CardHeader>
  );
};
