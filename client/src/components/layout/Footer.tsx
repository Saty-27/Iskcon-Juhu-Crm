import { useState } from 'react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { SocialLink } from '@shared/schema';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ['/api/social-links'],
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest('POST', '/api/subscribe', { email });
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to our newsletter!",
        variant: "success",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-poppins font-bold text-2xl mb-4">
              ISKCON <span className="text-secondary">Juhu</span>
            </h3>
            <p className="font-opensans mb-6">
              The International Society for Krishna Consciousness, founded by His Divine Grace 
              A.C. Bhaktivedanta Swami Prabhupada in 1966.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-secondary transition-colors"
                >
                  <i className={`${link.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="font-opensans hover:text-secondary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/donate">
                  <a className="font-opensans hover:text-secondary transition-colors">Donate</a>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <a className="font-opensans hover:text-secondary transition-colors">Events</a>
                </Link>
              </li>
              <li>
                <Link href="/gallery">
                  <a className="font-opensans hover:text-secondary transition-colors">Gallery</a>
                </Link>
              </li>
              <li>
                <Link href="/videos">
                  <a className="font-opensans hover:text-secondary transition-colors">Videos</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="font-opensans hover:text-secondary transition-colors">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold text-xl mb-4">Programs</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="font-opensans hover:text-secondary transition-colors">Morning Aarti</a>
              </li>
              <li>
                <a href="#" className="font-opensans hover:text-secondary transition-colors">Bhagavad Gita Classes</a>
              </li>
              <li>
                <a href="#" className="font-opensans hover:text-secondary transition-colors">Sunday Feast</a>
              </li>
              <li>
                <a href="#" className="font-opensans hover:text-secondary transition-colors">Kirtan Events</a>
              </li>
              <li>
                <a href="#" className="font-opensans hover:text-secondary transition-colors">Youth Programs</a>
              </li>
              <li>
                <a href="#" className="font-opensans hover:text-secondary transition-colors">Food for Life</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold text-xl mb-4">Newsletter</h4>
            <p className="font-opensans mb-4">
              Subscribe to receive updates on events, festivals, and spiritual insights.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 
                focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent 
                text-white placeholder-white placeholder-opacity-60" 
                required 
              />
              <button 
                type="submit" 
                className="w-full bg-secondary text-white font-poppins font-medium py-2 rounded-lg 
                hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 pt-8 text-center">
          <p className="font-opensans text-sm">&copy; {new Date().getFullYear()} ISKCON Juhu. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
