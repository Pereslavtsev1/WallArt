'use client';

import { useState } from 'react';
import {
  ActiveIndicator,
  HoverHighlight,
  Tab,
  Tabs,
} from '@/components/general/tabs';

export function ProfileTabs() {
  const tabTitles = ['Wallpapers', 'Collections'];
  const [selectedTab, setSelectedTab] = useState('Wallpapers');
  return (
    <div>
      <Tabs>
        <HoverHighlight />
        <ActiveIndicator />
        <div className='flex items-center gap-x-1'>
          {tabTitles.map((title, index) => (
            <Tab key={title} index={index}>
              {title}
            </Tab>
          ))}
        </div>
      </Tabs>
      {selectedTab === 'Wallpapers' ? (
        <div>Wallpapers</div>
      ) : (
        <div>Collections</div>
      )}
    </div>
  );
}
