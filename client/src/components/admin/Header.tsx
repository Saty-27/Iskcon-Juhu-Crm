import { useState } from 'react';
import { Menu, Download, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import useAuth from '@/hooks/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getPageTitle = () => {
    if (location === '/admin') return 'Dashboard';
    if (location === '/admin/donations') return 'Donation Management';
    if (location === '/admin/users') return 'User Management';
    if (location === '/admin/messages') return 'Message Management';
    if (location === '/admin/testimonials') return 'Testimonial Management';
    if (location === '/admin/social-links') return 'Social Links Management';
    return 'Admin Panel';
  };

  const showExportButton = location === '/admin/donations';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center md:hidden mr-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {showExportButton && (
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 font-medium transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            Export Donations
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center space-x-3 text-sm focus:outline-none"
            >
              <div className="h-10 w-10 rounded-full bg-purple-100 border-2 border-purple-200 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <span className="hidden md:inline-block font-medium text-gray-700">
                {user?.name || 'Admin User'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;