import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Banner } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import iskconDeitiesImg from "@assets/Website FFC_20250531_190536_0000_1749327853462.png";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: banners = [], isLoading, error } = useQuery<Banner[]>({
    queryKey: ['/api/banners'],
  });
  
  // Debug logging
  console.log('Banners data:', banners);
  console.log('Banners loading:', isLoading);
  console.log('Banners error:', error);
  
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
      <section className="relative overflow-hidden h-screen">
        <Skeleton className="w-full h-full" />
      </section>
    );
  }
  
  if (banners.length === 0) {
    return (
      <section className="relative overflow-hidden h-screen">
        <div className="h-full w-full absolute inset-0">
          <img 
            src={iskconDeitiesImg} 
            alt="Sri Sri Radha Rasabihari" 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-black bg-opacity-40 rounded-2xl p-6 sm:p-8 lg:p-12 backdrop-blur-sm">
              <h2 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 lg:mb-8 leading-tight drop-shadow-lg">
                Welcome to ISKCON Juhu
              </h2>
              <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                Experience divine bliss at the spiritual heart of Mumbai
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/donate" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-full 
                    inline-block transition-all transform hover:-translate-y-1 text-sm sm:text-base lg:text-lg shadow-lg">
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="relative overflow-hidden h-screen">
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`slide h-full w-full absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: index === currentSlide ? 15 : 5 }}
        >
          <img 
            src={banner.imageUrl} 
            alt={banner.title} 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-black bg-opacity-40 rounded-2xl p-6 sm:p-8 lg:p-12 backdrop-blur-sm">
                <h2 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 lg:mb-8 leading-tight drop-shadow-lg">
                  {banner.title}
                </h2>
                {banner.description && (
                  <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                    {banner.description}
                  </p>
                )}
                <div className="flex justify-center gap-4">
                  {banner.buttonText && banner.buttonLink ? (
                    <Link href={banner.buttonLink} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-full 
                        inline-block transition-all transform hover:-translate-y-1 text-sm sm:text-base lg:text-lg shadow-lg">
                      {banner.buttonText}
                    </Link>
                  ) : (
                    <Link href="/donate" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-full 
                        inline-block transition-all transform hover:-translate-y-1 text-sm sm:text-base lg:text-lg shadow-lg">
                      Donate Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Navigation */}
      {banners.length > 0 && (
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-0 right-0 z-30 flex justify-center space-x-2 sm:space-x-3">
          {banners.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full ${
                index === currentSlide 
                  ? 'bg-orange-500' 
                  : 'bg-white bg-opacity-60'
              } focus:outline-none transition-all hover:scale-110`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
