import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const ThankYou = () => {
  const [, setLocation] = useLocation();
  const [txnData, setTxnData] = useState<{ txnid?: string; amount?: string }>({});
  
  useEffect(() => {
    // Get transaction details from URL
    const params = new URLSearchParams(window.location.search);
    const txnid = params.get('txnid') || '';
    const amount = params.get('amount') || '';
    
    setTxnData({ txnid, amount });
    
    // If no transaction ID, redirect to donation page
    if (!txnid) {
      setLocation('/donate');
    }
  }, [setLocation]);
  
  return (
    <>
      <Helmet>
        <title>Thank You for Your Donation - ISKCON Juhu</title>
        <meta 
          name="description" 
          content="Thank you for your generous donation to ISKCON Juhu. Your contribution helps us maintain the temple and support our spiritual and community services."
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-[60vh] flex items-center justify-center py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="font-poppins font-bold text-3xl md:text-4xl text-primary mb-4">
                Thank You for Your Donation!
              </h1>
              
              <p className="font-opensans text-lg text-dark mb-6">
                Your generous contribution will help us maintain the temple, distribute prasadam, 
                and spread spiritual knowledge throughout society.
              </p>
              
              {txnData.txnid && (
                <div className="bg-neutral p-6 rounded-lg mb-6">
                  <h2 className="font-poppins font-semibold text-xl mb-4">Transaction Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="font-opensans text-gray-600">Transaction ID:</p>
                      <p className="font-opensans font-semibold">{txnData.txnid}</p>
                    </div>
                    <div>
                      <p className="font-opensans text-gray-600">Amount:</p>
                      <p className="font-opensans font-semibold">₹{Number(txnData.amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="font-opensans italic mb-6">
                A receipt has been sent to your email. Please check your inbox (and spam folder).
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setLocation('/')}
                  className="bg-primary hover:bg-opacity-90 text-white"
                >
                  Return to Home
                </Button>
                
                <Button
                  onClick={() => setLocation('/donate')}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Make Another Donation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ThankYou;