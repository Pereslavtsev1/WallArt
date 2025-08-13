import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchSessions } from '@/utils/types'
import { Key } from 'lucide-react'
import { Suspense } from 'react'
import DeviceList from './device-list'
import SettingsSection from './section'

const Security = ({ userId }: { userId: string }) => {
  const sessions = fetchSessions(userId)
  return (
    <SettingsSection>
      <SettingsSection.Header
        title="Security Settings"
        description="Manage your account security and authentication preferences."
      />
      <SettingsSection.Content>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-semibold">
              <Key className="h-5 w-5 text-primary" />
              <div className="space-y-1">
                <Label className="font-semibold">Password</Label>
                <p className="text-sm text-muted-foreground">
                  Change your account password.
                </p>
              </div>
              <Button className="ml-auto font-semibold">Change</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Login History</h3>
            <div className="space-y-3 font-semibold">
              <Suspense fallback=<DeviceListSkeleton />>
                <DeviceList promise={sessions} />
              </Suspense>
            </div>
          </div>
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  )
}

export default Security

const DeviceListSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="flex w-full items-center justify-between rounded-lg border px-4 py-2.5"
          >
            <div className="w-full space-y-2 pr-18">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
    </div>
  )
}
