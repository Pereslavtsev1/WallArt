'use client'
import SettingsSidebar from '@/components/general/settings/sidebar'
import SettingsProvider from '@/components/providers/settings-provider'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <SettingsProvider>
        <div className="mx-auto flex w-full max-w-7xl py-2 md:py-4 lg:py-8">
          <SettingsSidebar />
          {children}
        </div>
      </SettingsProvider>
    </SidebarProvider>
  )
}
