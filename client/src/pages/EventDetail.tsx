import { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Event, DonationCard, BankDetails } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, MapPin, Users, IndianRupee } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const EventDetail = () => {
  const [, params] = useRoute('/event/:id');
  const [, setLocation] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  
  const eventId = params?.id ? parseInt(params.id) : null;

  const { data: event, isLoading: eventLoading } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  const { data: donationCards = [], isLoading: cardsLoading } = useQuery<DonationCard[]>({
    queryKey: ['/api/donation-cards'],
  });

  const { data: bankDetails = [], isLoading: bankLoading } = useQuery<BankDetails[]>({
    queryKey: ['/api/bank-details'],
  });

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount > 0 && event) {
      setLocation(`/donate/payment?eventId=${event.id}&amount=${amount}`);
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-8 rounded-lg" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Filter donation cards for this event (you can customize this logic)
  const eventDonationCards = event.suggestedAmounts || [100, 500, 1000, 2500, 5000, 10000];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Section 1: Event Information */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 md:h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                }}
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{format(new Date(event.date), 'PPP')}</span>
              </div>
              
              <div className="text-gray-700 text-lg leading-relaxed mb-6">
                {event.description}
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">Support This Event</h3>
                <p className="text-indigo-700">
                  Your donation helps make this sacred event possible and reaches thousands of devotees.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 2: Donation Cards */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-indigo-900">
                  Choose Your Contribution
                </CardTitle>
                <p className="text-center text-gray-600">
                  Select a predefined amount or enter your custom donation
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {eventDonationCards.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={`h-16 text-lg font-semibold ${
                        selectedAmount === amount 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'border-indigo-200 hover:border-indigo-400'
                      }`}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      <IndianRupee className="w-5 h-5 mr-1" />
                      {amount.toLocaleString()}
                    </Button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="pl-10 text-lg"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleDonate}
                  disabled={!selectedAmount && !customAmount}
                  className="w-full h-12 text-lg font-semibold bg-orange-500 hover:bg-orange-600"
                >
                  Proceed to Donate
                  {(selectedAmount || customAmount) && (
                    <span className="ml-2">
                      ₹{(selectedAmount || parseFloat(customAmount) || 0).toLocaleString()}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Bank Details and QR Code */}
          <div className="space-y-6">
            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bankLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : bankDetails.length > 0 ? (
                  bankDetails.map((bank) => (
                    <div key={bank.id} className="border-l-4 border-indigo-500 pl-4">
                      <p className="font-semibold text-gray-900">{bank.bankName}</p>
                      <p className="text-sm text-gray-600">A/c: {bank.accountNumber}</p>
                      <p className="text-sm text-gray-600">IFSC: {bank.ifscCode}</p>
                      <p className="text-sm text-gray-600">{bank.accountName}</p>
                    </div>
                  ))
                ) : (
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <p className="font-semibold text-gray-900">ISKCON Juhu</p>
                    <p className="text-sm text-gray-600">A/c: 1234567890</p>
                    <p className="text-sm text-gray-600">IFSC: SBIN0001234</p>
                    <p className="text-sm text-gray-600">State Bank of India</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Quick Pay</CardTitle>
                <p className="text-sm text-gray-600">Scan to donate via UPI</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded border-2 border-gray-300 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                    <p className="text-xs text-gray-600">UPI Payment</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  UPI ID: iskconjuhu@paytm
                </p>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Event Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Target</span>
                  <span className="font-semibold">₹5,00,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Raised</span>
                  <span className="font-semibold text-green-600">₹3,25,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">65% Complete</span>
                  <span className="text-gray-600">127 Donors</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;