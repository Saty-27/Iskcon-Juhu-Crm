import { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Event, DonationCategory } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

const CurrentEvents = () => {
  const [, setLocation] = useLocation();
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const { data: categories = [] } = useQuery<DonationCategory[]>({
    queryKey: ['/api/donation-categories'],
  });

  const handleDonateClick = (eventTitle: string) => {
    // Find matching donation category by name or create a fallback
    const matchingCategory = categories.find(cat => 
      cat.name.toLowerCase().includes(eventTitle.toLowerCase()) || 
      eventTitle.toLowerCase().includes(cat.name.toLowerCase())
    );
    
    if (matchingCategory) {
      setLocation(`/donate/${matchingCategory.id}`);
    } else {
      // Default to first category if no match found
      setLocation(`/donate/${categories[0]?.id || 1}`);
    }
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
                  onClick={() => handleDonateClick(event.title)}
                >
                  Donate for {event.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentEvents;
