import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Use useEffect for navigation to avoid React warning
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      // Redirect to login page if not authenticated or not an admin
      setLocation('/login?redirect=/admin');
    }
  }, [isLoading, isAuthenticated, user?.role, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If not authenticated or not admin, show nothing while redirect happens
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;