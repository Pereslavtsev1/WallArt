import { ImagesIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

type CollectionCardChild =
  | React.ReactElement<typeof CollectionIcon>
  | React.ReactElement<typeof CollectionInfo>;
const CollectionCard = ({
  children,
  className,
  onClick,
}: {
  children?: CollectionCardChild | CollectionCardChild[];
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Card
      className={`p-2 border rounded-2xl bg-border/10 break-inside-avoid ${className}`}
      onClick={onClick}
    >
      <div className='rounded-2xl p-6 bg-background'>{children}</div>
    </Card>
  );
};

interface CollectionIconProps {
  className?: string;
}

export const CollectionIcon = ({ className }: CollectionIconProps) => {
  return (
    <div
      className={`bg-neutral-900 size-10 flex items-center justify-center rounded-full mb-4 ${className}`}
    >
      <ImagesIcon className='size-5' />
    </div>
  );
};

export const CollectionInfo = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

export default CollectionCard;
