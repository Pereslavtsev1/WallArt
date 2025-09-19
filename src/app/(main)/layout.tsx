'use server';
export default async function ({ children }: { children: React.ReactNode }) {
  return <main className='mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8'>{children}</main>;
}
