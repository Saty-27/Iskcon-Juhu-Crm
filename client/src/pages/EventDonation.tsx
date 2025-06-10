import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from 'react-helmet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Event, DonationCard, BankDetails } from "@shared/schema";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';



export default function EventDonation() {
  const { eventId } = useParams();
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

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

  const { data: donationCards = [] } = useQuery<DonationCard[]>({
    queryKey: ["/api/donation-cards"]
  });

  const { data: bankDetails = [] } = useQuery<BankDetails[]>({
    queryKey: ["/api/bank-details"]
  });

  const event = events.find(e => e.id === parseInt(eventId || "0"));
  
  // Filter donation cards to show all active cards (not filtered by category for events)
  const activeDonationCards = donationCards.filter(card => card.isActive);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedPrice(value === '' ? '' : value);
  };
  const currentBankDetail = bankDetails[0]; // Use first bank detail

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
        <section style={{ padding: '20px', backgroundColor: '#F5F3F3', color: '#333', minHeight: '100vh' }}>
      {/* Header Information */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px'
      }} className="flex-col md:flex-row">
        <div style={{
          flex: 1,
          backgroundImage: 'url(/gradientbg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Black overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '10px'
          }}></div>
          
          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            color: '#fff',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>
              {event.title}
            </h2>
            <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
              {event.description && getWordCount(event.description) > 20 
                ? getTruncatedDescription(event.description, 20)
                : event.description}
            </p>
            
            {/* Always show Read More button */}
            <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
              <DialogTrigger asChild>
                <button style={{
                  backgroundColor: '#faa817',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Read More
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{event.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              width: '100%',
              height: '350px',
              objectFit: 'cover',
              borderRadius: '10px'
            }}
          />
        </div>
      </div>

      {/* Dynamic Donation Cards from Admin Panel */}
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
        {event.title} Donation Options
      </h2>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {activeDonationCards.map((card) => (
          <div key={card.id} style={{
            backgroundColor: '#fff',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            flex: '1 1 calc(25% - 20px)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            minWidth: '250px',
            textAlign: 'center'
          }}>
            {/* Title */}
            <p style={{ 
              fontSize: '16px', 
              marginBottom: '10px', 
              fontWeight: 'bold' 
            }}>
              {card.title}
            </p>

            {/* Card Image */}
            {card.imageUrl && (
              <img 
                src={card.imageUrl} 
                alt={card.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
            )}

            {/* Amount */}
            <p style={{ 
              color: '#faa817', 
              marginBottom: '10px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              ₹{card.amount.toLocaleString()}
            </p>

            {/* Donate Button */}
            <Button 
              onClick={() => window.location.href = '/donate'}
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
            </Button>
          </div>
        ))}
      </div>

      {/* Custom Donation */}
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '30px',
        marginTop: '30px'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>
          Any Donation of Your Choice for {event.title}
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            type="number"
            value={selectedPrice}
            onChange={handleInputChange}
            placeholder="Enter the Amount"
            style={{
              flex: '1',
              minWidth: '200px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              height: '50px',
              fontSize: '18px',
              fontWeight: '500',
              padding: '5px 10px'
            }}
          />
          <Button
            onClick={() => window.location.href = '/donate'}
            style={{
              backgroundColor: '#faa817',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              height: '50px',
              fontSize: '18px',
              minWidth: '100px'
            }}
          >
            Donate
          </Button>
        </div>
      </div>

      {/* Account Details */}
      {currentBankDetail && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          gap: '20px'
        }} className="flex-col md:flex-row">
          <div style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Account Details</h3>
            <p><strong>Bank Name:</strong> {currentBankDetail.bankName}</p>
            <p><strong>Account Name:</strong> {currentBankDetail.accountName}</p>
            <p><strong>Account Number:</strong> {currentBankDetail.accountNumber}</p>
            <p><strong>IFSC Code:</strong> {currentBankDetail.ifscCode}</p>
            {currentBankDetail.swiftCode && (
              <p><strong>Swift Code:</strong> {currentBankDetail.swiftCode}</p>
            )}
          </div>
          
          {currentBankDetail.qrCodeUrl && (
            <div style={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Donate through UPI</h3>
              <img 
                src={currentBankDetail.qrCodeUrl} 
                alt="QR Code" 
                style={{ 
                  height: '200px', 
                  width: '200px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
          )}
        </div>
      )}
        </section>
      </main>
      
      <Footer />

    </>
  );
}