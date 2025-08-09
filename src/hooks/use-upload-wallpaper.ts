import { UploadWallpaperContext } from '@/components/providers/upload-wallpaper'
import { useContext } from 'react'

export function useUploadWallpaper() {
  const context = useContext(UploadWallpaperContext)

  if (context === undefined) {
    throw new Error(
      'useUploadWallpaper must be used within a upload-wallpaper-provider'
    )
  }

  return context
}
