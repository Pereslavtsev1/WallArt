import { HeartIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WallpaperAction = ({ value }: { value: boolean }) => {
  return (
    <>
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
    </>
  );
};

export default WallpaperAction;
