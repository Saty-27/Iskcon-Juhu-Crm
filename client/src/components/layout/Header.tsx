import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, X } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveStreamOpen, setLiveStreamOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const isHomePage = location === '/';
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled || !isHomePage ? 'bg-white bg-opacity-95 shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-primary font-poppins font-bold text-xl md:text-2xl">
              ISKCON <span className="text-secondary">Juhu</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-poppins font-medium text-primary hover:text-secondary transition-colors">
              Home
            </Link>
            <Link href="/donate" className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
              Donate
            </Link>
            <Link href="/events" className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
              Events
            </Link>
            <Link href="/gallery" className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
              Gallery
            </Link>
            <Link href="/videos" className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
              Videos
            </Link>
            <Link href="/blog" className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
              Contact
            </Link>
            <button 
              onClick={() => setLiveStreamOpen(true)}
              className="font-poppins font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors flex items-center gap-2 animate-pulse"
            >
              <Play className="w-4 h-4" />
              Watch Live
            </button>
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <span className="font-poppins text-dark font-medium">{user.name}</span>
                <Link 
                  href="/profile" 
                  className="font-poppins text-white bg-primary hover:bg-opacity-90 px-5 py-2 rounded-full transition-colors"
                >
                  My Profile
                </Link>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="font-poppins text-white bg-primary hover:bg-opacity-90 px-5 py-2 rounded-full transition-colors"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-primary text-2xl focus:outline-none"
          >
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden bg-white border-t ${mobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-4 py-2">
            <Link 
              href="/"
              className="font-poppins font-medium text-primary hover:text-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/donate"
              className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              Donate
            </Link>
            <Link 
              href="/events"
              className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              Events
            </Link>
            <Link 
              href="/gallery"
              className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>
            <Link 
              href="/videos"
              className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              Videos
            </Link>
            <Link 
              href="/blog"
              className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
            <Link 
              href="/contact"
              className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            <button 
              onClick={() => {
                setLiveStreamOpen(true);
                closeMobileMenu();
              }}
              className="font-poppins font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors flex items-center gap-2 animate-pulse justify-center"
            >
              <Play className="w-4 h-4" />
              Watch Live
            </button>
            {isAuthenticated && user ? (
              <div className="flex flex-col space-y-2">
                <span className="font-poppins text-dark font-medium">Welcome, {user.name}</span>
                <Link 
                  href="/profile"
                  className="font-poppins text-white bg-primary hover:bg-opacity-90 px-5 py-2 rounded-full text-center transition-colors"
                  onClick={closeMobileMenu}
                >
                  My Profile
                </Link>
              </div>
            ) : (
              <Link 
                href="/login"
                className="font-poppins text-white bg-primary hover:bg-opacity-90 px-5 py-2 rounded-full text-center transition-colors"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Live Stream Dialog */}
      <Dialog open={liveStreamOpen} onOpenChange={setLiveStreamOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>ISKCON Juhu Temple - Live Darshan</span>
              </div>
              <button
                onClick={() => setLiveStreamOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/@ISKCONJuhuTemple/live"
              title="ISKCON Juhu Temple Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Experience live darshan from ISKCON Juhu Temple
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Join thousands of devotees in spiritual connection
                </p>
              </div>
              <a
                href="https://www.youtube.com/@ISKCONJuhuTemple"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Visit YouTube Channel
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
