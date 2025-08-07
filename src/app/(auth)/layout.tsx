'use client'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = useUser()
  if (!user) redirect('/sign-in')
  return <main className="px-2 sm:px-4 md:px-6 lg:px-8">{children}</main>
}
