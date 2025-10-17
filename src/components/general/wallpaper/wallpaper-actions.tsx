import { HeartIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleLikeAction } from '@/server/actions/like-actions';

const WallpaperActions = ({
  value,
  className,
}: {
  value: boolean;
  className: string;
}) => {
  return (
    <div className={className}>
      <form action={toggleLikeAction()}>
        <Button
          size='icon'
          variant='default'
          className='bg-foreground/40 hover:bg-foreground/50'
        >
          <HeartIcon />
        </Button>
      </form>
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
