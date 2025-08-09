'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import SettingsSection from './section'

const General = () => {
  return (
    <SettingsSection>
      <SettingsSection.Header
        title="General Settings"
        description="Manage your general account settings and preferences."
      />

      <SettingsSection.Content>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-semibold">Public Profile</Label>
              <p className="text-sm font-semibold text-muted-foreground">
                Allow others to see your profile information.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </SettingsSection.Content>

      <SettingsSection.Footer className="justify-end">
        <Button className="px-10 font-semibold">Save Changes</Button>
      </SettingsSection.Footer>
    </SettingsSection>
  )
}

export default General
