import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from 'react-helmet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { DonationCategory, DonationCard, BankDetails } from "@shared/schema";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaymentModal from '@/components/payment/PaymentModal';

export default function CategoryDonation() {
  const { categoryId } = useParams();
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    donationCard?: DonationCard;
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

  // Fetch category data
  const { data: category, isLoading: categoryLoading } = useQuery<DonationCategory>({
    queryKey: [`/api/donation-categories/${categoryId}`],
    enabled: !!categoryId,
  });

  // Fetch donation cards for this category with better caching
  const { data: donationCards = [], isLoading: cardsLoading } = useQuery<DonationCard[]>({
    queryKey: [`/api/donation-cards/category/${categoryId}`],
    enabled: !!categoryId,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Fetch category-specific bank details
  const { data: bankDetails = [] } = useQuery<BankDetails[]>({
    queryKey: [`/api/categories/${categoryId}/bank-details`],
    enabled: !!categoryId,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Filter donation cards to show only active ones
  const activeDonationCards = donationCards.filter(card => card.isActive);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedPrice(value === '' ? '' : value);
  };

  // Handle donation card click - open payment modal directly (no auth check)
  const handleDonateClick = (card: DonationCard) => {
    setPaymentModal({
      isOpen: true,
      donationCard: card
    });
  };

  // Handle custom amount donation (no auth check)
  const handleCustomDonation = () => {
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

  const currentBankDetail = bankDetails[0]; // Use first bank detail

  if (categoryLoading || cardsLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">Category not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} - Donate - ISKCON Juhu</title>
        <meta name="description" content={`Support ${category.name} at ISKCON Juhu. ${category.description}`} />
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
                  {category.name}
                </h2>
                <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                  {category.description && getWordCount(category.description) > 20 
                    ? getTruncatedDescription(category.description, 20)
                    : category.description}
                </p>
                
                {/* Always show Read More button if there's a description */}
                {category.description && (
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
                        <DialogTitle>{category.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <img
                src={category.imageUrl}
                alt={category.name}
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
            {category.name} - {activeDonationCards.length} Donation Options
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {activeDonationCards.length > 0 ? activeDonationCards.map((card) => (
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

                {/* Description */}
                {card.description && (
                  <p style={{ 
                    fontSize: '14px', 
                    marginBottom: '10px', 
                    color: '#666' 
                  }}>
                    {card.description}
                  </p>
                )}

                {/* Amount */}
                <p style={{ 
                  color: '#faa817', 
                  marginBottom: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  ₹{card.amount.toLocaleString()}
                </p>

                {/* Donate Button */}
                <Button 
                  onClick={() => handleDonateClick(card)}
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
            )) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                border: '2px dashed #dee2e6',
                width: '100%'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#6c757d' }}>
                  No donation cards available for this category
                </h3>
                <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                  Donation cards for this category can be managed in the admin panel. 
                  Please visit the general donation page for other donation options.
                </p>
                <Button 
                  onClick={() => window.location.href = '/donate'}
                  style={{
                    backgroundColor: '#faa817',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Go to Donation Page
                </Button>
              </div>
            )}
          </div>

          {/* Custom Amount Section */}
          <div style={{
            marginTop: '40px',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              Any Donation of Your Choice for {category.name}
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Enter the Amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
              <Button
                onClick={handleCustomDonation}
                style={{
                  backgroundColor: '#faa817',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Donate
              </Button>
            </div>
          </div>

          {/* Bank Details and QR Code Section */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            marginTop: '40px' 
          }} className="grid-cols-1 lg:grid-cols-2">
            {/* Account Details */}
            {currentBankDetail && (
              <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                  Account Details
                </h3>
                <div style={{ lineHeight: '1.8' }}>
                  <p><strong>Bank Name:</strong> {currentBankDetail.bankName}</p>
                  <p><strong>Account Name:</strong> {currentBankDetail.accountName}</p>
                  <p><strong>Account Number:</strong> {currentBankDetail.accountNumber}</p>
                  <p><strong>IFSC Code:</strong> {currentBankDetail.ifscCode}</p>
                </div>
              </div>
            )}

            {/* QR Code */}
            {currentBankDetail && currentBankDetail.qrCodeUrl && (
              <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                  Donate through UPI
                </h3>
                <img
                  src={currentBankDetail.qrCodeUrl}
                  alt="QR Code for UPI Payment"
                  style={{
                    maxWidth: '200px',
                    height: 'auto',
                    margin: '0 auto'
                  }}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Payment Modal */}
      {paymentModal.isOpen && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={closePaymentModal}
          donationCard={paymentModal.donationCard}
          customAmount={paymentModal.customAmount}
          donationCategory={category}
        />
      )}

      <Footer />
    </>
  );
}