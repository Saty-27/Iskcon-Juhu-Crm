import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from 'react-helmet';
import type { DonationCategory, DonationCard, BankDetails } from "@shared/schema";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "@/components/payment/PaymentModal";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CategoryDonation() {
  const { categoryId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<DonationCard | null>(null);

  // Fetch category data
  const { data: category, isLoading: categoryLoading } = useQuery<DonationCategory>({
    queryKey: [`/api/donation-categories/${categoryId}`],
    enabled: !!categoryId,
  });

  // Fetch donation cards for this category
  const { data: donationCards = [], isLoading: cardsLoading } = useQuery<DonationCard[]>({
    queryKey: [`/api/donation-cards/category/${categoryId}`],
    enabled: !!categoryId,
  });

  // Fetch bank details
  const { data: bankDetails = [] } = useQuery<BankDetails[]>({
    queryKey: ["/api/bank-details"]
  });

  const handleDonateClick = (card: DonationCard, amount: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a donation.",
        variant: "destructive",
      });
      window.location.href = "/login";
      return;
    }

    setSelectedCard(card);
    setSelectedAmount(amount);
    setIsPaymentModalOpen(true);
  };

  const handleCustomDonateClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required", 
        description: "Please log in to make a donation.",
        variant: "destructive",
      });
      window.location.href = "/login";
      return;
    }

    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setSelectedCard(null);
    setSelectedAmount(amount);
    setIsPaymentModalOpen(true);
  };

  if (categoryLoading || cardsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600">The donation category you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getSuggestedAmounts = (): number[] => {
    if (category?.suggestedAmounts && Array.isArray(category.suggestedAmounts)) {
      return category.suggestedAmounts;
    }
    return [1001, 2501, 5001, 10001]; // Default fallback
  };

  const suggestedAmounts = getSuggestedAmounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Helmet>
        <title>{category.name} - Donation | ISKCON Juhu</title>
        <meta name="description" content={category.description || `Support ${category.name} through your generous donations`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-gray-600 mb-6">{category.description}</p>
          )}
          {category.heading && (
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{category.heading}</h2>
          )}
        </div>

        {/* Donation Cards Section */}
        {donationCards.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {category.name} - {donationCards.length} Donation Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {donationCards.map((card) => (
                <Card key={card.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {card.title}
                    </CardTitle>
                    {card.description && (
                      <p className="text-sm text-gray-600">{card.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      ₹{card.amount.toLocaleString()}
                    </div>
                    <Button
                      onClick={() => handleDonateClick(card, card.amount)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Add Donation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Custom Amount Section */}
        <div className="mb-8">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Any Donation of Your Choice for {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Enter the Amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={handleCustomDonateClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Donate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bank Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bankDetails.length > 0 && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bankDetails.map((bank) => (
                  <div key={bank.id} className="space-y-2">
                    <div><strong>Bank Name:</strong> {bank.bankName}</div>
                    <div><strong>Account Name:</strong> {bank.accountName}</div>
                    <div><strong>Account Number:</strong> {bank.accountNumber}</div>
                    <div><strong>IFSC Code:</strong> {bank.ifscCode}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {category.imageUrl && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Donate through UPI
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <img
                  src={category.imageUrl}
                  alt="QR Code"
                  className="mx-auto max-w-48 h-auto"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={selectedAmount}
          eventTitle={selectedCard ? selectedCard.title : category.name}
          eventId={selectedCard ? selectedCard.id : undefined}
          categoryId={parseInt(categoryId || "0")}
          donationType="category"
          user={user}
        />
      )}

      <Footer />
    </div>
  );
}