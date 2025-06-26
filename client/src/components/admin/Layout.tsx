import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Mobile content wrapper with top padding for fixed header */}
      <div className="md:ml-64 pt-16 md:pt-0">
        {/* Desktop Header - hidden on mobile since we use mobile header from Sidebar */}
        <div className="hidden md:block">
          <Header />
        </div>
        
        {/* Main content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
