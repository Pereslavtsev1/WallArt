'use client'

import { createContext, type ReactNode, useState } from 'react'
export enum SectionIDs {
  PROFILE = 'Profile',
  SECURITY = 'Security',
  GENERAL = 'General',
  APPEARANCE = 'Appearance',
}
type SettingsStore = {
  activeSection: SectionIDs
  setActiveSection: (value: SectionIDs) => void
}

export const SettingsContext = createContext<SettingsStore | undefined>(
  undefined
)

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState(SectionIDs.PROFILE)

  const value: SettingsStore = {
    activeSection,
    setActiveSection,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
