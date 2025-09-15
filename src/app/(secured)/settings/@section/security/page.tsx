import { auth } from '@clerk/nextjs/server';
import { Label } from '@radix-ui/react-label';
import { Key } from 'lucide-react';
import { Suspense } from 'react';
import { getUserSessions } from '@/actions/user-actions';
import DeviceList from '@/components/settings/sections/device-list';
import {
  SettingsSection,
  SettingsSectionContent,
  SettingsSectionHeader,
} from '@/components/settings/sections/section';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default async function SecuritySection() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  const sessions = getUserSessions(userId);

  return (
    <SettingsSection>
      <SettingsSectionHeader
        title='Security Settings'
        description='Manage your account security and authentication preferences.'
      />
      <SettingsSectionContent>
        <div className='space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-3 font-semibold'>
              <Key className='h-5 w-5 text-primary' />
              <div className='space-y-1'>
                <Label className='font-semibold text-base'>Password</Label>
                <p className='text-muted-foreground text-xs'>Change your account password.</p>
              </div>
              <Button className='ml-auto font-semibold'>Change</Button>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>Login History</h3>
            <div className='space-y-3 font-semibold'>
              <Suspense fallback=<DeviceListSkeleton />>
                <DeviceList promise={sessions} />
              </Suspense>
            </div>
          </div>
        </div>
      </SettingsSectionContent>
    </SettingsSection>
  );
}

const DeviceListSkeleton = () => {
  return (
    <div className='space-y-2'>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
            className='flex w-full items-center justify-between rounded-lg border px-4 py-2.5'
          >
            <div className='w-full space-y-2 pr-18'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-3 w-2/3' />
            </div>
            <Skeleton className='h-8 w-8 rounded-md' />
          </div>
        ))}
    </div>
  );
};
