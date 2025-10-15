'use client';

import { useState } from 'react';
import {
  ActiveIndicator,
  HoverHighlight,
  Tab,
  Tabs,
} from '@/components/general/tabs';
import InfinityScrollCollectionList from '../collection-list/infinity-scroll-collection-list';
import InfinityScrollWallpaperList from '../wallpaper-list/infinity-scroll-wallpaper-list';
import {
  loadMoreCollectionByUserId,
  loadMoreWallpaperByUserId,
} from './actions';

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
          <div className='columns-1 gap-x-2 sm:columns-2 md:columns-3 lg:columns-3'>
            <InfinityScrollWallpaperList
              className={''}
              props={{
                loadMoreAction: ({ limit, page }) =>
                  loadMoreWallpaperByUserId({ page, limit, userId }),
              }}
            />
          </div>
        ) : (
          <div className='columns-1 gap-x-2 sm:columns-2 md:columns-3 lg:columns-3'>
            <InfinityScrollCollectionList
              className=''
              props={{
                loadMoreAction: async ({ limit, page }) =>
                  loadMoreCollectionByUserId({ page, limit, userId }),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
