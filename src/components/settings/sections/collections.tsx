'use client'

import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { ForwardIcon, PlusIcon } from 'lucide-react'
import SettingsSection from './section'
import ImageCard from '@/components/general/image-card/image-card'

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

const Collections = () => {
  return (
    <SettingsSection>
      <SettingsSection.Header className="flex items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Collections</CardTitle>
          <CardDescription>Browse our wallpaper collections</CardDescription>
        </div>
        <Button>
          <PlusIcon />
          {/* TODO: change sm:grid */}
          <span className="hidden sm:grid">Add collection</span>
        </Button>
      </SettingsSection.Header>
      <SettingsSection.Content>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2">
          {collections.map((wallpaper) => (
            <ImageCard className="bg-background" key={wallpaper.id}>
              <ImageCard.Image src={wallpaper.imageUrl} alt="Description" />
              <ImageCard.Info
                title={wallpaper.title}
                description={wallpaper.description}
              />
              <ImageCard.Actions>
                <Button>Open</Button>
                <Button variant="secondary">
                  <ForwardIcon />
                  Share
                </Button>
              </ImageCard.Actions>
            </ImageCard>
          ))}
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  )
}

export default Collections
