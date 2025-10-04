'use client';

import { useState } from 'react';
import {
  ActiveIndicator,
  HoverHighlight,
  Tab,
  Tabs,
} from '@/components/general/tabs';
import type { Result } from '@/db';
import type { Collection } from '@/db/schema';
import { CollectionListWrapper } from '../collection-list/collection-list-wrapper';
import type { Streamable } from '../utils/stream';
import type { WallpaperListItem } from '../wallpaper-list/wallpaper-list';
import { WallpaperListWrapper } from '../wallpaper-list/wallpaper-list-wrapper';

type ProfileTabsProps = {
  wallpapersPromise: Streamable<Result<WallpaperListItem[]>>;

  collectionsPromise: Streamable<
    Result<Pick<Collection, 'id' | 'title' | 'description'>[]>
  >;
};
export function ProfileTabs({
  wallpapersPromise,
  collectionsPromise,
}: ProfileTabsProps) {
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
            <WallpaperListWrapper wallpapers={wallpapersPromise} />
          </div>
        ) : (
          <div className='columns-1 gap-x-2 sm:columns-2 md:columns-3 lg:columns-3'>
            <CollectionListWrapper collections={collectionsPromise} />
          </div>
        )}
      </div>
    </div>
  );
}
