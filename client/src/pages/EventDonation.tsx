import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from 'react-helmet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Event, EventDonationCard, BankDetails } from "@shared/schema";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaymentModal from '@/components/payment/PaymentModal';

export default function EventDonation() {
  const { eventId } = useParams();
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    eventDonationCard?: EventDonationCard;
    customAmount?: number;
  }>({
    isOpen: false
  });
  const [customAmount, setCustomAmount] = useState<string>('');

  // Helper function to count words
  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Helper function to get truncated description
  const getTruncatedDescription = (text: string, wordLimit: number): string => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"]
  });

  const { data: eventDonationCards = [] } = useQuery<EventDonationCard[]>({
    queryKey: [`/api/events/${eventId}/donation-cards`],
    enabled: !!eventId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: bankDetails = [] } = useQuery<BankDetails[]>({
    queryKey: ["/api/bank-details"]
  });

  const event = events.find(e => e.id === parseInt(eventId || "0"));
  
  // Filter event donation cards to show only active ones
  const activeEventDonationCards = eventDonationCards.filter(card => card.isActive);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedPrice(value === '' ? '' : value);
  };

  // Handle event donation card click - open payment modal
  const handleEventDonateClick = (card: EventDonationCard) => {
    setPaymentModal({
      isOpen: true,
      eventDonationCard: card
    });
  };

  // Handle custom amount donation for events
  const handleCustomEventDonation = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      setPaymentModal({
        isOpen: true,
        customAmount: amount
      });
    }
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false });
  };

  const currentBankDetail = bankDetails[0];

  if (!event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">Event not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event.title} - Donate - ISKCON Juhu</title>
        <meta name="description" content={`Support ${event.title} at ISKCON Juhu. ${event.description}`} />
      </Helmet>
      
      <Header />
      
      <main>
        <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 px-4 py-8 md:px-8">
          {/* Header Information */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 relative">
                <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/20 rounded-full -ml-12 -mb-12"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 md:p-12">
                    <div className="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-full text-sm font-medium mb-6">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      Live Event
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                      {event.title}
                    </h1>
                    
                    <p className="text-purple-100 text-lg leading-relaxed mb-8">
                      {event.description && getWordCount(event.description) > 25 
                        ? getTruncatedDescription(event.description, 25)
                        : event.description}
                    </p>
                    
                    <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
                      <DialogTrigger asChild>
                        <button className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
                          <span>Read More</span>
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-6">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {event.description}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-lg">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Cards Section */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-4">
                {event.title} Donation Options
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Choose from our specially curated donation packages to support this sacred event
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {activeEventDonationCards.length > 0 ? activeEventDonationCards.map((card, index) => (
                <div key={card.id} className="group relative">
                  <div className="relative bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Card Header with Gradient */}
                    <div className="bg-gradient-to-r from-purple-500 to-orange-500 h-2"></div>
                    
                    {/* Card Number Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Card {index + 1}
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6 pt-12">
                      <div className="text-center">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-4 min-h-[3rem] flex items-center justify-center">
                          {card.title}
                        </h3>
                        
                        {/* Amount */}
                        <div className="mb-6">
                          <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                            ₹{card.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">Recommended Amount</div>
                        </div>
                        
                        {/* Description */}
                        {card.description && (
                          <p className="text-gray-600 text-sm mb-6 leading-relaxed min-h-[2rem]">
                            {card.description.length > 80 
                              ? card.description.substring(0, 80) + "..."
                              : card.description}
                          </p>
                        )}
                        
                        {/* Donate Button */}
                        <Button 
                          onClick={() => handleEventDonateClick(card)}
                          className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <span className="mr-2">🙏</span>
                          Donate Now
                        </Button>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-orange-200/20 rounded-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-200/20 to-purple-200/20 rounded-full -ml-8 -mb-8"></div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full">
                  <div className="text-center bg-white rounded-3xl shadow-xl border-2 border-dashed border-purple-200 p-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      No donation cards available for this event
                    </h3>
                    <p className="text-gray-500 text-lg">
                      Please check back later or contact our team for more information.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Donation Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 md:p-12 mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Custom Donation Amount
                </h3>
                <p className="text-gray-600 text-lg">
                  Enter any amount you wish to donate for {event.title}
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-6 py-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      ₹
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCustomEventDonation}
                    disabled={!customAmount || parseInt(customAmount) <= 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-medium py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="mr-2">🙏</span>
                    Donate ₹{customAmount || '0'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Payment Modal */}
      {paymentModal.isOpen && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={closePaymentModal}
          eventDonationCard={paymentModal.eventDonationCard}
          customAmount={paymentModal.customAmount}
          eventTitle={event.title}
        />
      )}
    </>
  );
}