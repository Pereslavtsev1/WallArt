import { redirect } from 'next/navigation';
import ProfileForm from '@/components/forms/profile-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUserSession } from '@/server/actions/auth';

export default async function ProfileSection() {
  const user = await getUserSession();
  if (!user) {
    return redirect('/');
  }
  return (
    <Card className='bg-background'>
      <CardHeader className='font-semibold'>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm />
      </CardContent>
    </Card>
  );
}
