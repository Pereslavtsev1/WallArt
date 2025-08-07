'use client'

import SectionFactory from '@/components/settings/sections/factory'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSettings } from '@/hooks/use-settings'
import { useUser } from '@clerk/nextjs'

const SettingsPage = () => {
  const { activeSection } = useSettings()
  const factory = new SectionFactory()
  const isMobile = useIsMobile()
  const { user } = useUser()
  if (!user) return
  return (
    <div className="w-full space-y-2 overflow-hidden">
      {isMobile && (
        <header>
          <SidebarTrigger />
        </header>
      )}
      {factory.create(activeSection, user.id)}
    </div>
  )
}

export default SettingsPage
