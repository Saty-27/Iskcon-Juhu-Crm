import { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import DonationModal from '@/components/donate/DonationModal';

const CurrentEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
  
  const openDonationModal = (event: Event, amount: number | null = null) => {
    setSelectedEvent(event);
    setSelectedAmount(amount);
  };
  
  const closeDonationModal = () => {
    setSelectedEvent(null);
    setSelectedAmount(null);
  };
  
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-neutral rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row">
                <Skeleton className="h-56 md:h-auto md:w-1/3" />
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-full mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3].map((j) => (
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
  
  if (events.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary mb-4">
            Current Events
          </h2>
          <p className="font-opensans text-lg max-w-2xl mx-auto text-dark">
            Join us for these special occasions and contribute to make them a success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-neutral rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg flex flex-col md:flex-row"
            >
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="h-56 md:h-auto md:w-1/3 object-cover"
              />
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-poppins font-semibold text-xl text-primary">{event.title}</h3>
                  <span className="bg-secondary text-white text-xs font-poppins py-1 px-2 rounded">
                    {format(new Date(event.date), 'MMMM d, yyyy')}
                  </span>
                </div>
                <p className="font-opensans text-dark mb-4">{event.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.suggestedAmounts?.map((amount) => (
                    <button 
                      key={amount}
                      onClick={() => openDonationModal(event, amount)}
                      className="bg-white hover:bg-gray-100 text-dark font-medium py-1 px-3 rounded-full transition-colors"
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => openDonationModal(event)}
                  className="w-full bg-primary text-white font-poppins font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Donate for {event.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Donation Modal */}
      {selectedEvent && (
        <DonationModal 
          isOpen={true}
          event={selectedEvent}
          amount={selectedAmount}
          onClose={closeDonationModal}
        />
      )}
    </section>
  );
};

export default CurrentEvents;
