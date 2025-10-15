import type { ReactNode } from 'react';
import Header from '@/components/home/header';

const HeaderLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default HeaderLayout;
