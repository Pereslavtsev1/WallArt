import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UsetItemProps = {
  src: string;
  alt: string;
};
const UserItem = ({ src, alt }: UsetItemProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{alt}</AvatarFallback>
    </Avatar>
  );
};

export default UserItem;
