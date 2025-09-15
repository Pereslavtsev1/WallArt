'use client';
import { useUser } from '@clerk/nextjs';
import ProfileForm from '@/components/forms/profile-form';
import {
  SettingsSection,
  SettingsSectionContent,
  SettingsSectionHeader,
} from '@/components/settings/sections/section';

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  return (
    <SettingsSection>
      <SettingsSectionHeader title='Profile' description='Manage your profile settings.' />
      <SettingsSectionContent>
        <ProfileForm user={user} />
      </SettingsSectionContent>
    </SettingsSection>
  );
};

export default Profile;
