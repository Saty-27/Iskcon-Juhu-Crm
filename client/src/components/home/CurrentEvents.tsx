import { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Event, DonationCategory, DonationCard } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CurrentEvents = () => {
  const [, setLocation] = useLocation();
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const { data: categories = [] } = useQuery<DonationCategory[]>({
    queryKey: ['/api/donation-categories'],
  });

  const { data: donationCards = [] } = useQuery<DonationCard[]>({
    queryKey: ['/api/donation-cards'],
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleDonateClick = (amount?: number) => {
    if (selectedEvent) {
      // Find matching category for the event
      const matchingCategory = categories.find(cat => 
        cat.name.toLowerCase().includes(selectedEvent.title.toLowerCase()) || 
        selectedEvent.title.toLowerCase().includes(cat.name.toLowerCase())
      );
      
      const categoryId = matchingCategory?.id || categories[0]?.id || 1;
      const donationAmount = amount || parseFloat(customAmount) || 0;
      
      if (donationAmount > 0) {
        setLocation(`/donate/${categoryId}?amount=${donationAmount}`);
      } else {
        setLocation(`/donate/${categoryId}`);
      }
    }
    setSelectedEvent(null);
    setCustomAmount('');
  };

  const toggleExpanded = (eventId: number) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };
  
  if (isLoading) {
    return (
      <section className="current-events-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          <div className="current-events-grid">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
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
    <section className="current-events-section">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="current-events-title">Current Events</h1>
          <div className="title-underline"></div>
          <p className="current-events-subtitle">
            Join us for these special occasions and contribute to make them a success.
          </p>
        </div>

        {/* Events Grid */}
        <div className="current-events-grid">
          {events.map((event) => (
            <div key={event.id} className="current-event-card">
              {/* Event Image */}
              <div className="event-image-container">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="event-image"
                />
              </div>

              {/* Event Content */}
              <div className="event-content">
                <div className="event-header">
                  <h3 className="event-title">{event.title}</h3>
                  <span className="event-date">
                    {format(new Date(event.date), 'MMMM d, yyyy')}
                  </span>
                </div>

                {/* Event Description with Read More */}
                <div className={`event-description-container ${expandedEvent === event.id ? "expanded" : ""}`}>
                  {!expandedEvent || expandedEvent !== event.id ? (
                    <p className="event-description-preview">
                      {event.description?.slice(0, 100) || ''}
                      {event.description && event.description.length > 100 && (
                        <span 
                          className="read-more-btn" 
                          onClick={() => toggleExpanded(event.id)}
                        >
                          Read More ➤
                        </span>
                      )}
                    </p>
                  ) : (
                    <div className="full-content">
                      <p className="event-description-full">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Suggested Amounts */}
                {event.suggestedAmounts && event.suggestedAmounts.length > 0 && (
                  <div className="suggested-amounts">
                    {event.suggestedAmounts.slice(0, 3).map((amount) => (
                      <span key={amount} className="amount-tag">
                        ₹{amount.toLocaleString('en-IN')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Donate Button */}
                <button 
                  className="donate-event-button"
                  onClick={() => handleEventClick(event)}
                >
                  Donate for {event.title}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Receipt Information */}
        <div className="receipt-info">
          <h3 className="receipt-title">Receipts for your donation</h3>
          <p>
            80G available as per Income Tax Act 1961 and rules made thereunder.
            Tax Exemption Certificate Ref. No.: AAATI0017PF20219
          </p>
          <p>
            To get the receipt of donation made through NEFT, RTGS, IMPS PayTm,
            UPI as mentioned above, please share your legal name, postal address
            with pincode (and PAN if you need 80G receipt) along with transaction
            details on pranav@iskcontrust.org
          </p>
        </div>

        {/* Support */}
        <div className="support-section">
          <h3>Support</h3>
          <p>
            For more information please Call <b>+91-6263756519</b> from Monday to
            Saturday between 9:00am to 6:00pm
          </p>
        </div>
      </div>

      {/* Donation Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden" aria-describedby="donation-modal-description">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-center" style={{ color: '#4B0082' }}>
              {selectedEvent?.title}
            </DialogTitle>
            <p id="donation-modal-description" className="text-center text-gray-600 mt-2">
              Join us for this divine celebration and contribute to our sacred cause
            </p>
          </DialogHeader>
          
          <div className="p-6">
            {/* Predefined Amount Options */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[501, 1001, 2101].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDonateClick(amount)}
                  className="p-3 border-2 border-gray-200 rounded-lg text-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  <div className="text-lg font-semibold">₹{amount.toLocaleString('en-IN')}</div>
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the Amount
              </label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleDonateClick()}
                  className="px-8 text-white font-medium"
                  style={{ backgroundColor: '#FAA817' }}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                >
                  Donate
                </Button>
              </div>
            </div>

            {/* Main Donate Button */}
            <Button 
              onClick={() => handleDonateClick()}
              className="w-full py-3 text-white font-medium text-lg"
              style={{ backgroundColor: '#FAA817' }}
            >
              Donate for {selectedEvent?.title}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CurrentEvents;
