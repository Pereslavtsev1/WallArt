import SearchProvider from '@/components/providers/search-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SearchProvider>
      <main className="px-2 sm:px-4 md:px-6 lg:px-8">{children}</main>
    </SearchProvider>
  )
}
