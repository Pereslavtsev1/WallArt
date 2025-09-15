'use client';

import {
  SettingsSection,
  SettingsSectionContent,
  SettingsSectionFooter,
  SettingsSectionHeader,
} from '@/components/settings/sections/section';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const General = () => {
  return (
    <SettingsSection>
      <SettingsSectionHeader
        title='General Settings'
        description='Manage your general account settings and preferences.'
      />

      <SettingsSectionContent>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label className='font-semibold'>Public Profile</Label>
              <p className='text-sm font-semibold text-muted-foreground'>
                Allow others to see your profile information.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </SettingsSectionContent>

      <SettingsSectionFooter className='justify-end'>
        <Button className='px-10 font-semibold'>Save Changes</Button>
      </SettingsSectionFooter>
    </SettingsSection>
  );
};

export default General;
