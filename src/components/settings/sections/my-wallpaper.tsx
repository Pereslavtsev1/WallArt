import ImageCard from '@/components/general/image-card/image-card'
import { Button } from '@/components/ui/button'
import { EyeIcon, ForwardIcon, PlusIcon } from 'lucide-react'
import SettingsSection from './section'
import { useUploadWallpaper } from '@/hooks/use-upload-wallpaper'

export default function MyWallpaper() {
  const { toggle } = useUploadWallpaper()
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
      title: 'Mountain Lake',
      imageUrl:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Serene lake nestled among majestic mountains.',
    },
    {
      id: '6',
      title: 'Forest Path',
      imageUrl:
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'A peaceful path winding through a dense forest.',
    },
  ]

  return (
    <SettingsSection>
      <SettingsSection.Header className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">My wallpaper</h2>
          <p className="text-sm text-muted-foreground">
            Manage your custom wallpapers.
          </p>
        </div>
        <Button onClick={() => toggle()}>
          <PlusIcon className="h-4 w-4" />
          <span className="hidden font-semibold sm:inline">Add wallpaper</span>
        </Button>
      </SettingsSection.Header>
      <SettingsSection.Content>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((wallpaper) => (
            <ImageCard className="bg-background" key={wallpaper.id}>
              <ImageCard.Image src={wallpaper.imageUrl} alt="Description" />
              <ImageCard.Info
                title={wallpaper.title}
                description={wallpaper.description}
              />
              <ImageCard.Actions>
                <Button className="font-semibold">
                  <EyeIcon className="mt-0.5 size-4" />
                  View
                </Button>
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
