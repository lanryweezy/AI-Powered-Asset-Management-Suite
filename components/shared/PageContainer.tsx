import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => (
  <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-6">
    {children}
  </div>
);
