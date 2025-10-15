import { HeartIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WallpaperActions = ({
  value,
  className,
}: {
  value: boolean;
  className: string;
}) => {
  return (
    <div className={className}>
      <Button
        size='icon'
        variant='default'
        className='bg-foreground/40 hover:bg-foreground/50'
      >
        <HeartIcon />
      </Button>
      <Button
        size='icon'
        variant='default'
        className='bg-foreground/40 hover:bg-foreground/50'
      >
        <PlusIcon className='size-4.5' />
      </Button>
    </div>
  );
};

export default WallpaperActions;
