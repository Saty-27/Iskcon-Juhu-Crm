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
      
      <main style={{ padding: '20px', backgroundColor: '#F5F3F3', color: '#333', minHeight: '100vh' }}>
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            {event.title}
          </h1>
          
          {/* Title Underline */}
          <div style={{ 
            width: '100px', 
            height: '4px', 
            backgroundColor: '#faa817', 
            margin: '0 auto 20px auto', 
            borderRadius: '2px' 
          }}></div>

          {/* Event Description */}
          <div style={{ 
            background: '#fff5e1', 
            border: '2px solid #e3b04b', 
            borderRadius: '12px', 
            padding: '20px', 
            margin: '20px auto', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' 
          }}>
            <h3 style={{ 
              fontSize: '1.8rem', 
              color: '#b56a00', 
              textAlign: 'center', 
              fontWeight: 'bold' 
            }}>
              🙏 {event.title} 🙏
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              color: '#444', 
              lineHeight: '1.6', 
              textAlign: 'center' 
            }}>
              {event.description && getWordCount(event.description) > 25 
                ? getTruncatedDescription(event.description, 25)
                : event.description}
            </p>
          </div>

          {/* Donation Options Title */}
          <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
            Donate for {event.title}
          </h2>

          {/* Donation Cards */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            marginBottom: '30px' 
          }}>
            {activeEventDonationCards.length > 0 ? activeEventDonationCards.map((card) => (
              <div key={card.id} style={{ 
                backgroundColor: '#fff', 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                flex: '1 1 calc(25% - 20px)', 
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                minWidth: '200px'
              }}>
                <p style={{ 
                  fontSize: '16px', 
                  marginBottom: '10px', 
                  fontWeight: 'bold' 
                }}>
                  {card.title}
                </p>
                <p style={{ 
                  color: '#faa817', 
                  marginBottom: '10px', 
                  fontSize: '18px', 
                  fontWeight: 'bold' 
                }}>
                  ₹{card.amount.toLocaleString()}
                </p>
                {card.description && (
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666', 
                    marginBottom: '10px' 
                  }}>
                    {card.description}
                  </p>
                )}
                <button 
                  onClick={() => handleEventDonateClick(card)}
                  style={{ 
                    backgroundColor: '#faa817', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '10px 15px', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    width: '100%' 
                  }}
                >
                  Add Donation
                </button>
              </div>
            )) : (
              <div style={{ 
                textAlign: 'center', 
                backgroundColor: '#fff', 
                padding: '40px', 
                borderRadius: '8px', 
                width: '100%' 
              }}>
                <p>No donation cards available for this event</p>
              </div>
            )}
          </div>

          {/* Custom Donation */}
          <div style={{ 
            background: 'white', 
            borderRadius: '10px', 
            padding: '30px', 
            marginTop: '20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>
              Any Donation of Your Choice for {event.title}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
              <input 
                type="number" 
                style={{ 
                  width: '300px', 
                  borderRadius: '5px', 
                  border: '1px solid #ddd', 
                  height: '50px', 
                  fontSize: '18px', 
                  padding: '10px' 
                }} 
                value={customAmount} 
                onChange={(e) => setCustomAmount(e.target.value)} 
                placeholder="Enter the Amount"
              />
              <button 
                style={{ 
                  backgroundColor: '#faa817', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '15px 25px', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  fontSize: '18px' 
                }} 
                onClick={handleCustomEventDonation}
                disabled={!customAmount || parseInt(customAmount) <= 0}
              >
                Donate
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '30px', 
            gap: '20px' 
          }}>
            <div style={{ 
              flex: 1, 
              backgroundColor: '#fff', 
              padding: '20px', 
              borderRadius: '8px', 
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
            }}>
              <h3 style={{ marginBottom: '15px' }}>Account Details</h3>
              {currentBankDetail ? (
                <>
                  <p style={{ marginBottom: '8px' }}>Bank Name: {currentBankDetail.bankName}</p>
                  <p style={{ marginBottom: '8px' }}>Account Name: {currentBankDetail.accountName}</p>
                  <p style={{ marginBottom: '8px' }}>Account Number: {currentBankDetail.accountNumber}</p>
                  <p style={{ marginBottom: '8px' }}>IFSC Code: {currentBankDetail.ifscCode}</p>
                </>
              ) : (
                <p>No account details available</p>
              )}
            </div>
            
            <div style={{ 
              flex: 1, 
              textAlign: 'center', 
              backgroundColor: '#fff', 
              padding: '20px', 
              borderRadius: '8px', 
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
            }}>
              <h3 style={{ marginBottom: '15px' }}>Donate through UPI</h3>
              {currentBankDetail?.qrCodeUrl ? (
                <img 
                  src={currentBankDetail.qrCodeUrl} 
                  alt="QR Code" 
                  style={{ height: '200px', width: '200px', objectFit: 'contain' }}
                />
              ) : (
                <p>QR Code not available</p>
              )}
            </div>
          </div>

          {/* Receipt Information */}
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '20px', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '15px' }}>Receipts for your donation</h3>
            <p style={{ marginBottom: '10px' }}>
              Support {event.title} at ISKCON Juhu. Your donation helps us continue our sacred services.
            </p>
            <p style={{ marginBottom: '10px' }}>
              80G available as per Income Tax Act 1961 and rules made thereunder.
            </p>
            <p>
              To get the receipt of donation, please share your details with our team.
            </p>
          </div>

          {/* Support */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Support</h3>
            <p style={{ fontSize: '14px' }}>
              For more information please contact us for assistance.
            </p>
          </div>
        </div>
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