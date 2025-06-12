import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Images, 
  Calendar, 
  Film, 
  DollarSign, 
  Target, 
  Quote, 
  FileText,
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
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex-shrink-0 hidden md:block flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center">
          <h1 className="text-gray-900 font-bold text-xl">ISKCON Admin</h1>
        </Link>
      </div>
      
      <nav className="p-4 flex-col gap-4">
        <ul className="space-y-1">
          <li>
            <Link href="/admin" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/banners" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/banners') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Images className="mr-3 h-5 w-5" />
              <span className="font-medium">Banners</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/events" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/events') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Calendar className="mr-3 h-5 w-5" />
              <span className="font-medium">Events</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/gallery" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/gallery') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Images className="mr-3 h-5 w-5" />
              <span className="font-medium">Gallery</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/videos" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/videos') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Film className="mr-3 h-5 w-5" />
              <span className="font-medium">Videos</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/donations" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/donations') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <DollarSign className="mr-3 h-5 w-5" />
              <span className="font-medium">Donations</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/donation-categories" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/donation-categories') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Target className="mr-3 h-5 w-5" />
              <span className="font-medium">Donation Categories</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/quotes" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/quotes') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Quote className="mr-3 h-5 w-5" />
              <span className="font-medium">Quotes</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/blog" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/blog') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <FileText className="mr-3 h-5 w-5" />
              <span className="font-medium">Blog Management</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/users') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Users className="mr-3 h-5 w-5" />
              <span className="font-medium">Users</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/messages" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/messages') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Mail className="mr-3 h-5 w-5" />
              <span className="font-medium">Messages</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/testimonials" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/testimonials') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <MessageSquare className="mr-3 h-5 w-5" />
              <span className="font-medium">Testimonials</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/social-links" className={`flex items-center p-3 rounded-lg text-gray-700 transition-all duration-200 ${
              isActive('/admin/social-links') 
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600' 
                : 'hover:bg-gray-100'
            }`}>
              <Share className="mr-3 h-5 w-5" />
              <span className="font-medium">Social Links</span>
            </Link>
          </li>
        </ul>
        
        <div className="border-t border-gray-200 mt-4 pt-4">
          <Link 
            href="/"
            className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-all duration-200"
          >
            <Home className="mr-3 h-5 w-5" />
            <span className="font-medium">Back to Website</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;