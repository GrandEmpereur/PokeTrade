import NavBar from '@/components/navBar';
import React from 'react';

function SubRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <NavBar />
      {children}
    </main>
  );
}

export default SubRootLayout;
