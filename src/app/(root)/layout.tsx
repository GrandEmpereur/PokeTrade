import NavBar from '@/components/navBar';
import Footer from '@/components/footer';
import React from 'react';

function SubRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}

export default SubRootLayout;
