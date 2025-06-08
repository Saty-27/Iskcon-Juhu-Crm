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
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl">
            {/* Left Container - Gradient Background with Category Info */}
            <div className="flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white rounded-xl p-8 relative overflow-hidden">
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
                <div className="absolute top-1/2 right-0 w-16 h-16 bg-white rounded-full translate-x-8"></div>
              </div>
              
              <div className="relative z-10 h-full flex flex-col">
                <h1 className="font-poppins font-bold text-2xl md:text-3xl mb-4 text-white">
                  {category.name}
                </h1>
                
                <div className="mb-6 flex-1">
                  <p className="font-opensans text-base leading-relaxed text-white/90">
                    {showFullDescription ? (category.description || '') : truncateDescription(category.description || '')}
                  </p>
                  
                  {(category.description?.length || 0) > 100 && (
                    <Button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="bg-orange-500 hover:bg-orange-600 text-white mt-4 px-4 py-2 rounded text-sm font-medium"
                    >
                      {showFullDescription ? 'Read Less' : 'Read More'}
                    </Button>
                  )}
                </div>

                {/* Category Image */}
                {category.imageUrl && (
                  <div className="rounded-lg overflow-hidden mt-auto">
                    <img 
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Container - Donation Form */}
            <div className="flex-1 bg-white rounded-xl p-6 shadow-lg">
              <h2 className="font-poppins font-bold text-xl text-gray-800 mb-4">
                Make a Donation
              </h2>

              {/* Suggested Amounts */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3 text-sm">Select Amount:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {defaultAmounts.slice(0, 4).map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-3 rounded border-2 font-medium transition-all text-sm ${
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
                <h3 className="font-medium text-gray-700 mb-3 text-sm">Or enter custom amount:</h3>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>

              {/* Donation Summary */}
              {finalAmount > 0 && (
                <div className="bg-orange-50 rounded p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 text-sm">Donation Amount:</span>
                    <span className="font-bold text-lg text-orange-600">₹{finalAmount}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    For: {category.name}
                  </div>
                </div>
              )}

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={finalAmount <= 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {finalAmount > 0 ? `Donate ₹${finalAmount}` : 'Select Amount to Donate'}
              </Button>

              {/* Additional Info */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>• 80G tax exemption available</p>
                <p>• Secure payment processing</p>
                <p>• Instant receipt via email</p>
              </div>

              {/* Account Details Section */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Account Details</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Indian Overseas Bank</p>
                  <p>Account Name: ISKCON {category.name} Fund</p>
                  <p>IFSC Code: IOBA0001245</p>
                  <p>Account Number: 124501000012629</p>
                  <p>Swift Code: IOBAINBB</p>
                </div>
              </div>

              {/* UPI Section */}
              <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Donate through UPI</h3>
                <p className="text-xs text-gray-600 mb-3">ISKCON{category.name.replace(/\s+/g, '').toUpperCase()}@IOB</p>
                <div className="bg-white p-2 rounded inline-block">
                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    QR Code
                  </div>
                </div>
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
              {category.description || ''}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationPage;