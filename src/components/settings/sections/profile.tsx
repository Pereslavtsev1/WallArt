'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { ImageIcon } from 'lucide-react'
import SettingsSection from './section'
const Profile = () => {
  const user = useUser()

  const collections = [
    {
      id: '4',
      title: 'City Skyline',
      imageUrl:
        'https://images.unsplash.com/photo-1750841896955-23adce921f6f?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'A stunning view of a city skyline at sunset.',
    },

    {
      id: '5',
      title: 'City Skyline',
      imageUrl:
        'https://images.unsplash.com/photo-1750841896955-23adce921f6f?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'A stunning view of a city skyline at sunset.',
    },
    {
      id: '6',
      title: 'City Skyline',
      imageUrl:
        'https://images.unsplash.com/photo-1750841896955-23adce921f6f?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'A stunning view of a city skyline at sunset.',
    },
  ]
  return (
    <>
      <SettingsSection>
        <SettingsSection.Header
          title="Profile Information"
          description="Update your account profile information and email address."
        />
        <SettingsSection.Content>
          <div className="flex gap-x-6">
            <Avatar className="size-14 shadow-lg sm:size-16">
              <AvatarImage
                src={user.user?.imageUrl || '/placeholder.svg'}
                className="object-cover"
              />
              <AvatarFallback>{user.user?.username}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Button variant="default" className="items-center font-semibold">
                <ImageIcon className="size-4" />
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

        <SettingsSection.Content>
          <div className="space-y-4">
            <Label htmlFor="message" className="font-semibold">
              Profile description
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              required
              variant="ghost"
              rows={6}
              className="resize-none font-semibold placeholder:font-semibold"
            />
          </div>
        </SettingsSection.Content>
        <SettingsSection.Footer className="justify-end">
          <Button className="px-10 font-semibold">Update</Button>
        </SettingsSection.Footer>
      </SettingsSection>
    </>
  )
}

export default Profile
