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
      
      <section className="donation-section-anna">
        {/* Information Cards */}
        <div className="info-card-annas">
          <div className="info-card-anna">
            <h2 className="info-card-anna-title">{category.name}</h2>
            <p className="info-card-anna-description">
              {showFullDescription ? (category.description || '') : truncateDescription(category.description || '')}
            </p>
            
            {(category.description?.length || 0) > 100 && (
              <button 
                className="read-more-button-anna"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
          <div className="info-card-anna-image">
            {category.imageUrl && (
              <img
                src={category.imageUrl}
                alt={category.name}
                height="350px"
              />
            )}
          </div>
        </div>

        {/* Meal Donation Section */}
        {category.heading && (
          <h2 className="meal-donation-title-anna" style={{ marginBottom: '10px' }}>
            {category.heading}
          </h2>
        )}
        <h2 className="meal-donation-title-anna">Select Amount</h2>
        <div className="meal-options-anna">
          {defaultAmounts.map((amount, index) => (
            <div key={index} className="meal-option-anna">
              <p className="meal-label-anna">₹{amount.toLocaleString('en-IN')}</p>
              <button 
                className="add-donation-button" 
                onClick={() => handleAmountSelect(amount)}
              >
                Add Donation
              </button>
            </div>
          ))}
        </div>

        {/* Custom Donation */}
        <div className="custome-donation" style={{background:'white',borderRadius:'10px',padding:'50px',marginTop:'10px'}}>
          <h3 style={{marginBottom:'10px'}}>Any Donation of Your Choice</h3>
          <input 
            type="number" 
            style={{
              width:'70%',
              borderRadius:'5px',
              marginRight:'10px',
              border:'1px solid',
              height:'50px',
              fontSize:'25px',
              fontWeight:'500',
              padding:'5px',
              marginTop:'10px'
            }} 
            value={customAmount} 
            onChange={handleCustomAmountChange} 
            placeholder="Enter the Amount"
          />
          <button 
            style={{
              backgroundColor: '#faa817',
              color: '#fff',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              height:'63px',
              fontSize:'25px',
              marginTop:'10px'
            }}  
            onClick={handleDonate}
            disabled={finalAmount <= 0}
          >
            Donate
          </button>
        </div>

        {/* Account Details */}
        <div className="account-details">
          <div className="account-info">
            <h3 className="account-title">Account Details</h3>
            <p>Indian Overseas Bank</p>
            <p>Account Name: ISKCON {category.name} Fund</p>
            <p>IFSC Code: IOBA0001245</p>
            <p>Account Number: 124501000012629</p>
            <p>Swift Code: IOBAINBB</p>
          </div>
          <div className="qr-code">
            <h3 className="qr-title">Donate through UPI :- ISKCON{category.name.replace(/\s+/g, '').toUpperCase()}@IOB</h3>
            <div style={{height:'285px',width:'300px', backgroundColor:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px'}}>
              <span>QR Code Placeholder</span>
            </div>
          </div>
        </div>
      </section>

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