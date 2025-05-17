import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Banner } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

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
      {/* Slider Items */}
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`slide h-full w-full absolute inset-0 transition-opacity ${
            index === currentSlide ? 'active' : ''
          }`}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
          <img 
            src={banner.imageUrl} 
            alt={banner.title} 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-white font-poppins font-bold text-3xl md:text-5xl mb-4">
                {banner.title}
              </h2>
              {banner.description && (
                <p className="text-white font-opensans text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                  {banner.description}
                </p>
              )}
              {banner.buttonText && banner.buttonLink && (
                <Link href={banner.buttonLink}>
                  <a className="bg-secondary text-white font-poppins font-medium px-8 py-3 rounded-full 
                    inline-block hover:bg-opacity-90 transition-all transform hover:-translate-y-1">
                    {banner.buttonText}
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Slider Navigation */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-60'
            } focus:outline-none`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
