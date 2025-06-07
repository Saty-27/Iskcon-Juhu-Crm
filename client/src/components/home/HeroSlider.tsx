import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Banner } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import iskconDeitiesImg from "@assets/Website FFC_20250531_190536_0000_1749327853462.png";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['/api/banners'],
  });
  
  // Auto-advance slides
  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);
  
  if (isLoading) {
    return (
      <section className="relative overflow-hidden h-[500px] md:h-[600px]">
        <Skeleton className="w-full h-full" />
      </section>
    );
  }
  
  if (banners.length === 0) {
    return null;
  }
  
  return (
    <section className="relative overflow-hidden h-[500px] md:h-[600px]">
      {/* Main Hero Section with ISKCON Deities */}
      <div className="h-full w-full absolute inset-0">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <img 
          src={iskconDeitiesImg} 
          alt="Sri Sri Radha Rasabihari" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="hero-heading">
              Sri Sri Radha Rasabihari Mandir
            </h1>
            <p className="text-white text-lg md:text-xl mt-6 max-w-2xl mx-auto">
              Experience divine consciousness at ISKCON Juhu, Mumbai's most sacred temple
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link href="/donate">
                <a className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full 
                  inline-block transition-all transform hover:-translate-y-1">
                  Donate Now
                </a>
              </Link>
              <Link href="/events">
                <a className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black 
                  font-bold px-8 py-3 rounded-full inline-block transition-all">
                  View Events
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Banner Slides */}
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`slide h-full w-full absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: index === currentSlide ? 15 : 5 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
          <img 
            src={banner.imageUrl} 
            alt={banner.title} 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-white font-bold text-3xl md:text-5xl mb-4">
                {banner.title}
              </h2>
              {banner.description && (
                <p className="text-white text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                  {banner.description}
                </p>
              )}
              <div className="flex justify-center gap-4">
                <Link href="/donate">
                  <a className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full 
                    inline-block transition-all transform hover:-translate-y-1">
                    Donate Now
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Navigation */}
      {banners.length > 0 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide 
                  ? 'bg-orange-500' 
                  : 'bg-white bg-opacity-60'
              } focus:outline-none transition-all`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
