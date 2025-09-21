import { ImagesIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CollectionWithCount } from '@/db/schema';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const CollectionDropdown = ({
  collections,
  children,
}: {
  collections: CollectionWithCount[];
  children: ReactNode;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent
        side='bottom'
        align='end'
        className='max-h-80 overflow-y-auto'
      >
        <DropdownMenuItem className='font-semibold'>
          Collections
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {collections.map((collection) => (
          <DropdownMenuItem key={collection.id} className='px-0'>
            <Button variant='ghost' className='px-0'>
              <ImagesIcon />
              <div className='flex flex-col items-start truncate font-semibold'>
                <p className='max-w-52 shrink-0 truncate overflow-hidden text-sm'>
                  {collection.title} {'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {collection.wallpaperCount} items
                </p>
              </div>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionDropdown;
