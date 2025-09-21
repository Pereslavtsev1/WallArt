'use client';
import { HeartIcon, PlusIcon } from 'lucide-react';
import { use } from 'react';
import { useCollectionPromise } from '../providers/collection-provider';
import { Button } from '../ui/button';
import CollectionDropdown from './collection-dropdown';

const WallpaperAction = () => {
  const res = use(useCollectionPromise());
  if (!res.success) throw new Error(res.error);
  console.log(res.data);
  return (
    <>
      <Button variant='secondary' size='icon'>
        <HeartIcon />
      </Button>
      <CollectionDropdown collections={res.data}>
        <Button variant='secondary' size='icon'>
          <PlusIcon className='size-4.5' />
        </Button>
      </CollectionDropdown>
    </>
  );
};

export default WallpaperAction;
