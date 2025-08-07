'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@clerk/nextjs'
import { ImageIcon } from 'lucide-react'
import SettingsSection from './section'
import { SectionIDs } from '@/components/providers/settings-provider'

const Profile = () => {
  const user = useUser()

  return (
    <SettingsSection id={SectionIDs.PROFILE}>
      <SettingsSection.Header
        title="Profile Information"
        description="Update your account profile information and email address."
      />

      <SettingsSection.Content>
        <div className="flex gap-x-6">
          <Avatar className="size-14 shadow-lg sm:size-16">
            <AvatarImage src={user.user?.imageUrl} className="object-cover" />
            <AvatarFallback>{user.user?.username}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <Button variant="default" className="items-center font-semibold">
              <ImageIcon />
              Edit Avatar
            </Button>
            <p className="text-sm font-semibold text-muted-foreground">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Username</Label>
          <Input className="py-5 font-semibold" variant="ghost" />
        </div>
      </SettingsSection.Content>

      <SettingsSection.Footer className="justify-end">
        <Button className="px-10 font-semibold">Update</Button>
      </SettingsSection.Footer>
    </SettingsSection>
  )
}

export default Profile
