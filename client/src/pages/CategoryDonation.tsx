import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from 'react-helmet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { DonationCategory, DonationCard, BankDetails } from "@shared/schema";
import DonationModal from "@/components/donate/DonationModal";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface DonationOption {
  label: string;
  price: string;
}

export default function CategoryDonation() {
  const { categoryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const { data: categories = [] } = useQuery<DonationCategory[]>({
    queryKey: ["/api/donation-categories"]
  });

  const { data: cards = [] } = useQuery<DonationCard[]>({
    queryKey: ["/api/donation-cards"]
  });

  const { data: bankDetails = [] } = useQuery<BankDetails[]>({
    queryKey: ["/api/bank-details"]
  });

  const category = categories.find(c => c.id === parseInt(categoryId || "0"));
  const categoryCards = cards.filter(card => card.categoryId === parseInt(categoryId || "0"));

  const openModalWithPrice = (price: string) => {
    setSelectedPrice(price);
    setIsModalOpen(true);
  };

  const openModalWithAnyPrice = () => {
    if (selectedPrice) {
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedPrice(value === '' ? '' : value);
  };

  // Define donation options based on category
  const getDonationOptions = (): DonationOption[] => {
    switch (parseInt(categoryId || "0")) {
      case 1: // Temple Renovation
        return [
          { label: "General Temple Maintenance", price: "1001" },
          { label: "Temple Infrastructure", price: "2501" },
          { label: "Temple Equipment", price: "5001" },
          { label: "Complete Renovation Support", price: "10001" },
        ];
      case 2: // Anna Seva
        return [
          { label: "Donate 10 plates", price: "500" },
          { label: "Donate 25 plates", price: "1250" },
          { label: "Donate 50 plates", price: "2500" },
          { label: "Donate 100 plates", price: "5000" },
          { label: "Donate 200 plates", price: "10000" },
          { label: "Donate 500 plates", price: "25000" },
        ];
      case 3: // Education
        return [
          { label: "Student Support Fund", price: "1001" },
          { label: "Educational Materials", price: "2001" },
          { label: "Scholarship Fund", price: "5001" },
          { label: "Complete Education Support", price: "10001" },
        ];
      case 4: // Festivals
        return [
          { label: "Festival Decoration", price: "1001" },
          { label: "Festival Prasadam", price: "2501" },
          { label: "Festival Celebration", price: "5001" },
          { label: "Complete Festival Sponsorship", price: "10001" },
        ];
      case 5: // Deity Worship
        return [
          { label: "Mangal Aarti (4:30 am)", price: "3501" },
          { label: "Sringar Aarti (7:15 am)", price: "2501" },
          { label: "Puspa Aarti (8:30 am)", price: "2501" },
          { label: "Raj Bhoga Aarti (12:00 pm)", price: "3501" },
          { label: "Utthapana Aarti (4:30 pm)", price: "2501" },
          { label: "Sandhya Aarti (7:00 pm)", price: "3501" },
          { label: "Shayan Aarti (8:30 pm)", price: "2501" },
          { label: "Daily Flower Garlands for all Deities", price: "11001" },
          { label: "Deity Altar Flower Decoration (Simple)", price: "15001" },
        ];
      default:
        return [];
    }
  };

  const donationOptions = getDonationOptions();
  const currentBankDetail = bankDetails[0]; // Use first bank detail

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
          background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
          color: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>
            {category.heading || category.name}
          </h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            {category.description && getWordCount(category.description) > 20 
              ? getTruncatedDescription(category.description, 20)
              : category.description}
          </p>
          
          {category.description && getWordCount(category.description) > 20 && (
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
                  <DialogTitle>{category.heading || category.name}</DialogTitle>
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

      {/* Donation Options */}
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
        {category.name} Donation Options
      </h2>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {donationOptions.map((option, index) => (
          <div key={index} style={{
            backgroundColor: '#fff',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            flex: '1 1 calc(25% - 20px)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            minWidth: '250px'
          }}>
            <p style={{ 
              fontSize: '16px', 
              marginBottom: '10px', 
              fontWeight: 'bold' 
            }}>
              {option.label}
            </p>
            <p style={{ 
              color: '#faa817', 
              marginBottom: '10px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              ₹{parseInt(option.price).toLocaleString()}
            </p>
            <Button 
              onClick={() => openModalWithPrice(option.price)}
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
          Any Donation of Your Choice for {category.name}
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
            onClick={openModalWithAnyPrice}
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
                  borderRadius: '8px'
                }}
              />
            </div>
          )}
        </div>
      )}
        </section>
      </main>
      
      <Footer />

      <DonationModal
        isOpen={isModalOpen}
        category={category}
        amount={parseInt(selectedPrice) || null}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}