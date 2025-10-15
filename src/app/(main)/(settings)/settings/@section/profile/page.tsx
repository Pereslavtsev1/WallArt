import ProfileForm from '@/components/forms/profile-form';
import { ProfileTabs } from '@/components/general/profile/profile-tabs';
import { Stream } from '@/components/general/utils/stream';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserSession } from '@/server/actions/auth';

export default async function ProfileSection() {
  return (
    <Card className='bg-background'>
      <CardHeader className='font-semibold'>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Stream
          value={getUserSession()}
          fallback={
            <div className='space-y-8'>
              <div className='space-y-2'>
                <Skeleton className='h-3.5 w-32' />

                <Skeleton className='h-9 w-full' />
              </div>

              <div className='space-y-2'>
                <Skeleton className='h-3.5 w-32' />

                <Skeleton className='h-36 w-full' />
              </div>
            </div>
          }
          errorFallback={undefined}
        >
          {(user) => {
            if (!user) throw new Error('User not found');
            return (
              <ProfileForm user={{ username: user.user.name, ...user.user }} />
            );
          }}
        </Stream>
      </CardContent>
    </Card>
  );
}
