'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type UserItemProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function UserItem({ src, alt, className }: UserItemProps) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{alt[0]}</AvatarFallback>
    </Avatar>
  );
}
