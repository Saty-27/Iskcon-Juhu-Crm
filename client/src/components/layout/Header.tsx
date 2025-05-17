import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
            <Link href="/">
              <a className="font-poppins font-medium text-primary hover:text-secondary transition-colors">
                Home
              </a>
            </Link>
            <Link href="/donate">
              <a className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
                Donate
              </a>
            </Link>
            <Link href="/events">
              <a className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
                Events
              </a>
            </Link>
            <Link href="/gallery">
              <a className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
                Gallery
              </a>
            </Link>
            <Link href="/videos">
              <a className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
                Videos
              </a>
            </Link>
            <Link href="/contact">
              <a className="font-poppins font-medium text-dark hover:text-secondary transition-colors">
                Contact
              </a>
            </Link>
            <Link href={isAuthenticated ? '/profile' : '/login'}>
              <a className="font-poppins text-white bg-primary hover:bg-opacity-90 px-5 py-2 rounded-full transition-colors">
                {isAuthenticated ? 'My Profile' : 'Login'}
              </a>
            </Link>
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
            <Link href="/">
              <a 
                className="font-poppins font-medium text-primary hover:text-secondary transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </a>
            </Link>
            <Link href="/donate">
              <a 
                className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
                onClick={closeMobileMenu}
              >
                Donate
              </a>
            </Link>
            <Link href="/events">
              <a 
                className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
                onClick={closeMobileMenu}
              >
                Events
              </a>
            </Link>
            <Link href="/gallery">
              <a 
                className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
                onClick={closeMobileMenu}
              >
                Gallery
              </a>
            </Link>
            <Link href="/videos">
              <a 
                className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
                onClick={closeMobileMenu}
              >
                Videos
              </a>
            </Link>
            <Link href="/contact">
              <a 
                className="font-poppins font-medium text-dark hover:text-secondary transition-colors"
                onClick={closeMobileMenu}
              >
                Contact
              </a>
            </Link>
            <Link href={isAuthenticated ? '/profile' : '/login'}>
              <a 
                className="font-poppins text-white bg-primary hover:bg-opacity-90 px-5 py-2 rounded-full text-center transition-colors"
                onClick={closeMobileMenu}
              >
                {isAuthenticated ? 'My Profile' : 'Login'}
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
