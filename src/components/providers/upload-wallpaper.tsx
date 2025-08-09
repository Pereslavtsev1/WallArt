'use client'
import { createContext, type ReactNode, useState } from 'react'

type UploadWallpaperStore = {
  open: boolean
  setOpen: (value: boolean) => void
  toggle: () => void
}

export const UploadWallpaperContext = createContext<
  UploadWallpaperStore | undefined
>(undefined)

const UploadWallpaperProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false)
  const value: UploadWallpaperStore = {
    open: open,
    setOpen: setOpen,
    toggle: () => setOpen((prev) => !prev),
  }

  return (
    <UploadWallpaperContext.Provider value={value}>
      {children}
    </UploadWallpaperContext.Provider>
  )
}

export default UploadWallpaperProvider
