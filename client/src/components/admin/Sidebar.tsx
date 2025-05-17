import { Link, useRoute } from 'wouter';
import {
  LucideIcon,
  Home,
  Image,
  DollarSign,
  Calendar,
  Camera,
  Youtube,
  Quote,
  MessageSquare,
  Share2,
  Users,
  FileText,
  Gift,
  Settings,
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import useAuth from '@/hooks/useAuth';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, onClick }: SidebarItemProps) => {
  const [isActive] = useRoute(href);
  
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center py-2 px-3 my-1 text-sm font-medium rounded-md",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground",
        )}
        onClick={onClick}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </a>
    </Link>
  );
};

const Sidebar = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      logout();
      toast({
        title: "Logged Out",
        description: "You have successfully logged out.",
        variant: "success",
      });
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="h-full w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="py-6 px-4 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground flex items-center">
          ISKCON <span className="text-sidebar-primary ml-1">Admin</span>
        </h2>
      </div>
      
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          <SidebarItem icon={Home} label="Dashboard" href="/admin" />
          <SidebarItem icon={Image} label="Banners" href="/admin/banners" />
          <SidebarItem icon={Quote} label="Quotes" href="/admin/quotes" />
          <SidebarItem icon={DollarSign} label="Donation Sections" href="/admin/donation-sections" />
          <SidebarItem icon={Calendar} label="Event Donations" href="/admin/event-donations" />
          <SidebarItem icon={Camera} label="Gallery" href="/admin/gallery" />
          <SidebarItem icon={Youtube} label="Videos" href="/admin/videos" />
          <SidebarItem icon={Gift} label="Testimonials" href="/admin/testimonials" />
          <SidebarItem icon={MessageSquare} label="Contact Messages" href="/admin/contact-messages" />
          <SidebarItem icon={Share2} label="Social Media" href="/admin/social-media" />
          <SidebarItem icon={FileText} label="Donations" href="/admin/donations" />
          <SidebarItem icon={Users} label="Users" href="/admin/users" />
        </div>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-1">
          <SidebarItem icon={Settings} label="Settings" href="/admin/settings" />
          <a 
            className="flex items-center py-2 px-3 my-1 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
