'use client';

import { useTheme } from 'next-themes';
import SettingsSection from '@/components/settings/sections/section';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const AppearancePage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection>
      <SettingsSection.Header
        title='Appearance'
        description='Customize the appearance of the application.'
      />
      <SettingsSection.Content>
        <div className='space-y-4'>
          <Label className='font-semibold'>Application Theme</Label>
          <div className='flex justify-start gap-3 pt-2'>
            {/* Light Theme */}
            <div className='flex flex-col items-center space-y-3'>
              <button
                type='button'
                onClick={() => setTheme('light')}
                className={cn(
                  'relative border-2 rounded-lg p-2 transition-all duration-300 hover:scale-105',
                  theme === 'light'
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <div className='w-20 space-y-2 rounded-md bg-white p-3 shadow-sm'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-3 w-3 rounded-full bg-gray-200' />
                    <div className='flex-1 space-y-1'>
                      <div className='h-1.5 w-10 rounded-sm bg-gray-300' />
                      <div className='h-1 w-8 rounded-sm bg-gray-300' />
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <div className='h-1.5 w-full rounded-sm bg-gray-300' />
                    <div className='h-1.5 w-3/4 rounded-sm bg-gray-300' />
                  </div>
                  <div className='flex space-x-1'>
                    <div className='h-2 w-6 rounded-sm bg-gray-300' />
                    <div className='h-2 w-8 rounded-sm bg-gray-300' />
                  </div>
                </div>
              </button>
              <span className='text-sm font-medium'>Light</span>
            </div>

            {/* Dark Theme */}
            <div className='flex flex-col items-center space-y-3'>
              <button
                type='button'
                onClick={() => setTheme('dark')}
                className={cn(
                  'relative border-2 rounded-lg p-2 transition-all duration-300 hover:scale-105',
                  theme === 'dark'
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <div className='w-20 space-y-2 rounded-md bg-gray-950 p-3'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-3 w-3 rounded-full bg-gray-700' />
                    <div className='flex-1 space-y-1'>
                      <div className='h-1.5 w-10 rounded-sm bg-gray-600' />
                      <div className='h-1 w-8 rounded-sm bg-gray-600' />
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <div className='h-1.5 w-full rounded-sm bg-gray-600' />
                    <div className='h-1.5 w-3/4 rounded-sm bg-gray-600' />
                  </div>
                  <div className='flex space-x-1'>
                    <div className='h-2 w-6 rounded-sm bg-gray-600' />
                    <div className='h-2 w-8 rounded-sm bg-gray-600' />
                  </div>
                </div>
              </button>
              <span className='text-sm font-medium'>Dark</span>
            </div>
          </div>
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
};

export default AppearancePage;
