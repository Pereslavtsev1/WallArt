import { LogOutIcon } from 'lucide-react';
import { headers } from 'next/headers';
import { Stream } from '@/components/general/utils/stream';
import DeviceListSkeleton from '@/components/skeletons/device-list-skeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { revokeSession } from '@/server/actions/session-actions';

export default async function SecuritySection() {
  const sessionsPromise = auth.api.listSessions({
    headers: await headers(),
  });
  return (
    <Card className='bg-background'>
      <CardHeader className='font-semibold'>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security and authentication preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <h1 className='text-sm font-semibold'>Device List</h1>
          <Stream
            value={sessionsPromise}
            fallback={<DeviceListSkeleton />}
            errorFallback={<div>Error</div>}
          >
            {(data) => {
              const session = data;
              console.log(session);
              return (
                <div className='w-full space-y-2'>
                  {session.length > 0 ? (
                    session.map((session) => (
                      <div
                        key={session.id}
                        className='flex w-full items-center justify-between rounded-lg border px-4 py-2'
                      >
                        <div className='w-full space-y-1 truncate'>
                          <p className='truncate text-sm font-semibold'>
                            {session.userAgent}
                          </p>

                          <p className='text-xs font-semibold text-muted-foreground'>
                            Last active:{' '}
                            {new Date(session.updatedAt).toLocaleString()}
                          </p>
                        </div>
                        <form
                          action={async () => {
                            'use server';
                            await revokeSession(session.token);
                          }}
                        >
                          <Button
                            type='submit'
                            variant='ghost'
                            size='icon'
                            className='hover:text-destructive'
                          >
                            <LogOutIcon className='h-4 w-4' />
                          </Button>
                        </form>
                      </div>
                    ))
                  ) : (
                    <p>No session data available.</p>
                  )}
                </div>
              );
            }}
          </Stream>
        </div>
      </CardContent>
    </Card>
  );
}
