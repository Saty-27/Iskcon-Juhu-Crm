import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuth from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      setLocation('/login');
    }
  }, [isAuthenticated, user, isLoading, setLocation]);
  
  // Show loading or nothing until authentication is checked
  if (isLoading || !isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
