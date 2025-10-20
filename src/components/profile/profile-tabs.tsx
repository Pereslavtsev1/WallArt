'use client';

import { useState } from 'react';
import {
  ActiveIndicator,
  HoverHighlight,
  Tab,
  Tabs,
} from '@/components/general/tabs';
import WallpapersTab from './wallpapers-tab';

export function ProfileTabs({ userId }: { userId: string }) {
  const tabTitles = ['Wallpapers', 'Collections'];
  const [selectedTab, setSelectedTab] = useState('Wallpapers');

  return (
    <div>
      <Tabs>
        <HoverHighlight />
        <ActiveIndicator />
        <div className='flex items-center gap-x-1'>
          {tabTitles.map((title, index) => (
            <Tab
              key={title}
              index={index}
              className='flex-1'
              onClick={() => setSelectedTab(title)}
            >
              {title}
            </Tab>
          ))}
        </div>
      </Tabs>

      <div className='pt-4'>
        {selectedTab === 'Wallpapers' ? (
          <WallpapersTab userId={userId} />
        ) : (
          <div className='columns-1 gap-x-2 sm:columns-2 md:columns-3 lg:columns-3'></div>
        )}
      </div>
    </div>
  );
}
