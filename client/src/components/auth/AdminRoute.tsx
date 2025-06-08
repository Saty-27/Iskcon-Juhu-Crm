import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  // Authentication temporarily disabled for testing
  return <>{children}</>;
};

export default AdminRoute;