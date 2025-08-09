'use client'
import WallpaperUpload from '@/components/general/modals/wallpaper-upload'
import SettingsSidebar from '@/components/general/settings/sidebar'
import SettingsProvider from '@/components/providers/settings-provider'
import UploadWallpaperProvider from '@/components/providers/upload-wallpaper'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <SettingsProvider>
        <UploadWallpaperProvider>
          <div className="mx-auto flex w-full max-w-7xl py-2 md:py-4 lg:py-8">
            <SettingsSidebar />
            {children}
          </div>
          <WallpaperUpload />
        </UploadWallpaperProvider>
      </SettingsProvider>
    </SidebarProvider>
  )
}
