import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UsetItemProps = {
  src: string;
  alt: string;
  className?: string;
};
const UserItem = ({ src, alt, className }: UsetItemProps) => {
  return (
    <Avatar className={`${className}`}>
      <AvatarImage src={src} />
      <AvatarFallback>{alt}</AvatarFallback>
    </Avatar>
  );
};

export default UserItem;
