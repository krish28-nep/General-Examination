'use client';

import { ClientHeader } from '@/components/shared/ClientHeader';
import { Footer } from '@/components/shared/Footer';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClientHeader />
      {children}
      <Footer/>
    </>
  );
};

export default MainLayout;
