import React from 'react';
import { Header } from './Header';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-neutral-600 text-sm">
            © 2025 Meal Planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
