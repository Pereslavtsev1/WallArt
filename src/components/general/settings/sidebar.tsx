'use client'
import { SectionIDs } from '@/components/providers/settings-provider'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useSettings } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'
import {
  Folders,
  ImageIcon,
  Palette,
  Settings,
  Shield,
  User,
} from 'lucide-react'

const SettingsSidebar = () => {
  const { activeSection, setActiveSection } = useSettings()
  const { setOpenMobile } = useSidebar()
  const settingsNavigation = [
    {
      title: 'Account',
      items: [
        {
          section: SectionIDs.PROFILE,
          icon: User,
        },
        {
          section: SectionIDs.SECURITY,
          icon: Shield,
        },
        {
          section: SectionIDs.COLLECTIONS,
          icon: Folders,
        },
        {
          section: SectionIDs.MYWALLPAPER,
          icon: ImageIcon,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          section: SectionIDs.GENERAL,
          icon: Settings,
        },
        {
          section: SectionIDs.APPEARANCE,
          icon: Palette,
        },
      ],
    },
  ]
  return (
    <Sidebar variant="sidebar" className="relative w-80 border-none">
      <SidebarHeader className="bg-background">
        <h1 className="px-2 text-xl font-bold">Settings</h1>
      </SidebarHeader>
      <div className="h-full bg-background">
        {settingsNavigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="font-semibold">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.section} className="px-2">
                    <SidebarMenuButton asChild>
                      <Button
                        className={cn(
                          'h-10 justify-start font-semibold transition-colors duration-300',
                          activeSection === item.section ? 'bg-accent' : ''
                        )}
                        variant="ghost"
                        onClick={() => {
                          setActiveSection(item.section)
                          setOpenMobile(false)
                        }}
                      >
                        <item.icon />
                        <span className="truncate">{item.section}</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </div>
    </Sidebar>
  )
}

export default SettingsSidebar
