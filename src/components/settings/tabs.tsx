'use client';
import { FoldersIcon, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export type TabItem = {
  label: string;
  icon: LucideIcon;
  value: string;
};

export type TabsProps = {
  className?: string;
};

const Tabs = ({ className }: TabsProps) => {
  const [_selectedTab, _setSelectedTab] = useState<'wallpapers' | 'collections'>(
    'wallpapers',
  );
  return (
    <nav className={`${className} flex w-full gap-x-2`}>
      <Button className='flex-1 font-semibold'>
        <FoldersIcon />
        Collections
      </Button>

      <Button className='flex-1 font-semibold'>
        <FoldersIcon />
        Collections
      </Button>
    </nav>
  );
};

export default Tabs;
