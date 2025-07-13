import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page with redirect parameter
      const currentPath = location;
      setLocation(`/login?redirect=${encodeURIComponent(currentPath)}`);
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      // Redirect to home if user is not admin
      setLocation('/');
    }
  }, [isAuthenticated, user, isLoading, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;