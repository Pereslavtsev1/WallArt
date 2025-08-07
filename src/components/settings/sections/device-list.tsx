'use client'
import { Button } from '@/components/ui/button'
import { Session } from '@/utils/types'
import { LogOutIcon } from 'lucide-react'
import { use } from 'react'

export default function DeviceList({
  promise,
}: {
  promise: Promise<Session[]>
}) {
  const sessions = use(promise)

  return (
    <div className="w-full space-y-2">
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <div
            key={session.id}
            className="flex w-full items-center justify-between rounded-lg border px-4 py-2"
          >
            <div className="w-full space-y-1 truncate">
              <p className="truncate text-sm">
                {session.latest_activity.browser_name}{' '}
                {session.latest_activity.browser_version} on{' '}
                {session.latest_activity.device_type}
              </p>

              <p className="text-xs text-muted-foreground">
                Last active: {new Date(session.last_active_at).toLocaleString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-destructive"
            >
              <LogOutIcon className="h-4 w-4" />
            </Button>
          </div>
        ))
      ) : (
        <p>No session data available.</p>
      )}
    </div>
  )
}
