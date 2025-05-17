import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DonationCategory } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import DonationModal from '@/components/donate/DonationModal';

const DonationCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  
  const { data: categories = [], isLoading } = useQuery<DonationCategory[]>({
    queryKey: ['/api/donation-categories'],
  });
  
  const openDonationModal = (category: DonationCategory, amount: number | null = null) => {
    setSelectedCategory(category);
    setSelectedAmount(amount);
  };
  
  const closeDonationModal = () => {
    setSelectedCategory(null);
    setSelectedAmount(null);
  };
  
  if (isLoading) {
    return (
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-full mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-8 w-16 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-neutral">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary mb-4">
            Support Our Initiatives
          </h2>
          <p className="font-opensans text-lg max-w-2xl mx-auto text-dark">
            Your generous contributions help sustain our mission of spiritual education, 
            community service, and temple maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:transform hover:scale-105"
            >
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-xl text-primary mb-2">{category.name}</h3>
                <p className="font-opensans text-dark mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.suggestedAmounts?.map((amount) => (
                    <button 
                      key={amount}
                      onClick={() => openDonationModal(category, amount)}
                      className="bg-gray-100 hover:bg-gray-200 text-dark font-medium py-1 px-3 rounded-full transition-colors"
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => openDonationModal(category)}
                  className="w-full bg-primary text-white font-poppins font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Donation Modal */}
      {selectedCategory && (
        <DonationModal 
          isOpen={true}
          category={selectedCategory}
          amount={selectedAmount}
          onClose={closeDonationModal}
        />
      )}
    </section>
  );
};

export default DonationCategories;
