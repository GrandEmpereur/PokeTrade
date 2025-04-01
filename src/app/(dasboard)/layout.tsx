import React from 'react';

function SubRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}

export default SubRootLayout;
