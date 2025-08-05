'use client'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Wallpaper } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  return (
    <header className="flex h-16 items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-x-2">
        <Wallpaper />
        <h1 className="text-lg font-bold">WallArt</h1>
      </div>
      <SignedOut>
        <div className="flex items-center gap-x-2">
          <Button
            className="font-semibold"
            onClick={() => router.push('/sign-up')}
          >
            Sign up
          </Button>
          <Button
            className="font-semibold"
            onClick={() => router.push('/sign-in')}
          >
            Login
          </Button>
        </div>
      </SignedOut>
      <SignedIn></SignedIn>
    </header>
  )
}

export default Header
