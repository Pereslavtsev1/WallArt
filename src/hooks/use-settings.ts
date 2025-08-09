import { SettingsContext } from '@/components/providers/settings-provider'
import { useContext } from 'react'

export function useSettings() {
  const context = useContext(SettingsContext)

  if (context === undefined) {
    throw new Error('useSettings must be used within a settings-provider')
  }

  return context
}
