import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from 'react-helmet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Event Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 text-white">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-purple-100 text-lg mb-6">
              {event.description && getWordCount(event.description) > 25 
                ? getTruncatedDescription(event.description, 25)
                : event.description}
            </p>
            <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">
                  Read More
                </Button>
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

          {/* Tabs for Event Details */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="donation-cards">Donation Cards</TabsTrigger>
              <TabsTrigger value="custom-donation">Custom Donation</TabsTrigger>
              <TabsTrigger value="payment-details">Payment Details</TabsTrigger>
            </TabsList>

            {/* Event Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Event Title</h3>
                      <p className="text-gray-600">{event.title}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Description</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                    {event.imageUrl && (
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-lg mb-2">Event Image</h3>
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-full max-w-md rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donation Cards Tab */}
            <TabsContent value="donation-cards" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{event.title} - Donation Options</h2>
                <p className="text-gray-600">Choose from our donation packages to support this event</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeEventDonationCards.length > 0 ? activeEventDonationCards.map((card) => (
                  <Card key={card.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                      <div className="text-3xl font-bold text-orange-600 mb-4">₹{card.amount}</div>
                      {card.description && (
                        <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                      )}
                      <Button 
                        onClick={() => handleEventDonateClick(card)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Add Donation
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No donation cards available for this event</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Custom Donation Tab */}
            <TabsContent value="custom-donation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Any Donation of Your Choice for {event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor="custom-amount">Enter the Amount</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button 
                      onClick={handleCustomEventDonation}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                      disabled={!customAmount || parseInt(customAmount) <= 0}
                    >
                      Donate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Details Tab */}
            <TabsContent value="payment-details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentBankDetail ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Bank Name:</Label>
                          <p className="font-medium">{currentBankDetail.bankName}</p>
                        </div>
                        <div>
                          <Label>Account Name:</Label>
                          <p className="font-medium">{currentBankDetail.accountName}</p>
                        </div>
                        <div>
                          <Label>Account Number:</Label>
                          <p className="font-medium">{currentBankDetail.accountNumber}</p>
                        </div>
                        <div>
                          <Label>IFSC Code:</Label>
                          <p className="font-medium">{currentBankDetail.ifscCode}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No bank details available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Donate through UPI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentBankDetail?.qrCodeUrl ? (
                      <div className="text-center">
                        <img 
                          src={currentBankDetail.qrCodeUrl} 
                          alt="UPI QR Code"
                          className="mx-auto mb-4 max-w-48"
                        />
                        <p className="text-sm text-gray-600">Scan to donate via UPI</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">UPI QR Code not available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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