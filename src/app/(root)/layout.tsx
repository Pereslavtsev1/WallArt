'use client';
import Header from '@/components/home/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto'>
      <Header />
      {children}
    </main>
  );
}
