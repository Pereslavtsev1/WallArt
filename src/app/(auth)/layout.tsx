'use client'
import { useAuth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = useAuth()
  if (auth.isLoaded && !auth.isSignedIn) {
    return redirect('/sign-in')
  }
  return <main className="px-2 sm:px-4 md:px-6 lg:px-8">{children}</main>
}
