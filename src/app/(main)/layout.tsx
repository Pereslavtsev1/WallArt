import type { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return <main className='px-2 sm:px-4 md:px-6 lg:px-8'>{children}</main>;
};

export default MainLayout;
