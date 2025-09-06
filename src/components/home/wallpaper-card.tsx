import type { ReactNode } from 'react';
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
  onClick?: () => void;
};
export const WallpaperCard = ({
  className,
  onClick,
  children,
}: WallpaperCardProps) => {
  return (
    <Card
      className={`p-0 relative overflow-hidden mb-4 bg-background border-none ring-1 ring-background group transition-all duration-300 ${className}`}
      onClick={onClick}
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
  return <CardContent className={`p-0 ${className}`}>{children}</CardContent>;
};

type WallpaperCardImageProps = {
  height: number;
  width: number;
  className?: string;
  children: ReactNode;
};
export const WallpaperCardImage = ({
  className,
  width,
  height,
  children,
}: WallpaperCardImageProps) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    >
      {children}
    </div>
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
    <CardAction className={`flex gap-x-2 ${className}`}>{children}</CardAction>
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
  return <CardHeader className={className}>{children}</CardHeader>;
};
