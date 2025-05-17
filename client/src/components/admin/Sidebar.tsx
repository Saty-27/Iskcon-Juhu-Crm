import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Images, 
  Calendar, 
  Film, 
  DollarSign, 
  Target, 
  Quote, 
  Users, 
  Mail, 
  MessageSquare,
  Share,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className="w-64 bg-primary text-white h-screen flex-shrink-0 hidden md:block">
      <div className="p-4 border-b border-primary-dark">
        <Link href="/" className="flex items-center">
          <h1 className="text-white font-poppins font-bold text-xl">ISKCON Admin</h1>
        </Link>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className={`flex items-center p-2 rounded-lg ${isActive('/admin') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/banners" className={`flex items-center p-2 rounded-lg ${isActive('/admin/banners') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Images className="mr-3 h-5 w-5" />
              <span>Banners</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/events" className={`flex items-center p-2 rounded-lg ${isActive('/admin/events') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Calendar className="mr-3 h-5 w-5" />
              <span>Events</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/gallery" className={`flex items-center p-2 rounded-lg ${isActive('/admin/gallery') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Images className="mr-3 h-5 w-5" />
              <span>Gallery</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/videos" className={`flex items-center p-2 rounded-lg ${isActive('/admin/videos') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Film className="mr-3 h-5 w-5" />
              <span>Videos</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/donations" className={`flex items-center p-2 rounded-lg ${isActive('/admin/donations') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <DollarSign className="mr-3 h-5 w-5" />
              <span>Donations</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/donation-categories" className={`flex items-center p-2 rounded-lg ${isActive('/admin/donation-categories') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Target className="mr-3 h-5 w-5" />
              <span>Donation Categories</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/quotes" className={`flex items-center p-2 rounded-lg ${isActive('/admin/quotes') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Quote className="mr-3 h-5 w-5" />
              <span>Quotes</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={`flex items-center p-2 rounded-lg ${isActive('/admin/users') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Users className="mr-3 h-5 w-5" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/messages" className={`flex items-center p-2 rounded-lg ${isActive('/admin/messages') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Mail className="mr-3 h-5 w-5" />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/testimonials" className={`flex items-center p-2 rounded-lg ${isActive('/admin/testimonials') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <MessageSquare className="mr-3 h-5 w-5" />
              <span>Testimonials</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/social-links" className={`flex items-center p-2 rounded-lg ${isActive('/admin/social-links') ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Share className="mr-3 h-5 w-5" />
              <span>Social Links</span>
            </Link>
          </li>
        </ul>
        
        <div className="border-t border-primary-dark mt-4 pt-4">
          <Link 
            href="/"
            className="flex items-center p-2 rounded-lg text-white hover:bg-white/10 w-full"
          >
            <Home className="mr-3 h-5 w-5" />
            <span>Back to Website</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;