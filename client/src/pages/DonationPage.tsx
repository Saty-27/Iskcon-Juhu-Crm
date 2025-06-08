import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { DonationCategory } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/layout/Header';
import { Helmet } from 'react-helmet';

const DonationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  const { data: categories = [], isLoading } = useQuery<DonationCategory[]>({
    queryKey: ['/api/donation-categories'],
  });

  const category = categories.find(cat => cat.id === parseInt(id || ''));

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="bg-white rounded-xl p-8">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Donation Category Not Found</h1>
            <p className="text-gray-600">The requested donation category could not be found.</p>
          </div>
        </div>
      </>
    );
  }

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const defaultAmounts = category.suggestedAmounts || [501, 1001, 2501, 5001, 10001, 25001];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleDonate = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (amount && amount > 0) {
      // Redirect to payment processing or show payment modal
      console.log('Processing donation:', { category: category.name, amount });
      // TODO: Implement payment processing
    }
  };

  const finalAmount = selectedAmount || parseInt(customAmount) || 0;

  return (
    <>
      <Helmet>
        <title>{category.name} - Donate - ISKCON Juhu</title>
        <meta name="description" content={`Support ${category.name} at ISKCON Juhu. ${category.description}`} />
        <meta property="og:title" content={`${category.name} - Donate - ISKCON Juhu`} />
        <meta property="og:description" content={`Support ${category.name} at ISKCON Juhu. ${category.description}`} />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Container - Gradient Background with Category Info */}
            <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white rounded-xl p-8 relative overflow-hidden">
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
                <div className="absolute top-1/2 right-0 w-16 h-16 bg-white rounded-full translate-x-8"></div>
              </div>
              
              <div className="relative z-10">
                <h1 className="font-poppins font-bold text-3xl md:text-4xl mb-6">
                  {category.name}
                </h1>
                
                <div className="mb-6">
                  <p className="font-opensans text-lg leading-relaxed">
                    {showFullDescription ? category.description : truncateDescription(category.description)}
                  </p>
                  
                  {category.description.length > 100 && (
                    <Button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      variant="ghost"
                      className="text-white hover:text-orange-100 hover:bg-white/10 mt-4 p-0 h-auto font-medium"
                    >
                      {showFullDescription ? 'Read Less' : 'Read More'}
                    </Button>
                  )}
                </div>

                {/* Category Image */}
                {category.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Container - Donation Form */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="font-poppins font-bold text-2xl text-gray-800 mb-6">
                Make a Donation
              </h2>

              {/* Suggested Amounts */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-4">Select Amount:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {defaultAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-3 rounded-lg border-2 font-medium transition-all ${
                        selectedAmount === amount
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300 text-gray-700'
                      }`}
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Or enter custom amount:</h3>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>

              {/* Donation Summary */}
              {finalAmount > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Donation Amount:</span>
                    <span className="font-bold text-xl text-orange-600">₹{finalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    For: {category.name}
                  </div>
                </div>
              )}

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={finalAmount <= 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-poppins font-medium py-3 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {finalAmount > 0 ? `Donate ₹${finalAmount.toLocaleString('en-IN')}` : 'Select Amount to Donate'}
              </Button>

              {/* Additional Info */}
              <div className="mt-6 text-sm text-gray-600">
                <p>• 80G tax exemption available</p>
                <p>• Secure payment processing</p>
                <p>• Instant receipt via email</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description Modal */}
      <Dialog open={showFullDescription} onOpenChange={setShowFullDescription}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-poppins text-xl text-orange-600">
              {category.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="font-opensans text-gray-700 leading-relaxed">
              {category.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationPage;