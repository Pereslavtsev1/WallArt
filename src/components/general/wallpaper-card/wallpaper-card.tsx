import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function WallpaperCard({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={cn(
        'group relative mb-2 break-inside-avoid overflow-hidden rounded-2xl border-none bg-transparent p-0 flex-1',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

export function WallpaperCardContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <CardContent className={cn('p-0', className)}>{children}</CardContent>;
}

export function WallpaperCardHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <CardHeader className={cn('p-0 flex gap-x-1 @container-normal', className)}>
      {children}
    </CardHeader>
  );
}

export function WallpaperCardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardFooter className={cn('flex items-center gap-x-2 p-0', className)}>
      {children}
    </CardFooter>
  );
}

export function WallpaperCardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardTitle
      className={cn('truncate text-sm font-semibold text-white', className)}
    >
      {children}
    </CardTitle>
  );
}

export function WallpaperCardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardDescription
      className={cn(
        'truncate text-xs font-semibold text-muted-foreground',
        className,
      )}
    >
      {children}
    </CardDescription>
  );
}

export function WallpaperCardActions({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <CardAction className={cn('items-center gap-x-1 flex', className)}>
      {children}
    </CardAction>
  );
}
