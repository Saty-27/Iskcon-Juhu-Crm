import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, Link } from 'wouter';
import { CheckCircle, Download, Home, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PaymentSuccess = () => {
  const [location] = useLocation();
  const [transactionDetails, setTransactionDetails] = useState<{
    txnid: string;
    amount: string;
  } | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txnid = urlParams.get('txnid');
    const amount = urlParams.get('amount');
    
    if (txnid && amount) {
      setTransactionDetails({ txnid, amount });
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>Payment Successful - ISKCON Juhu</title>
        <meta name="description" content="Your donation has been successfully processed. Thank you for supporting ISKCON Juhu." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-poppins text-green-600">
                  Payment Successful!
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Thank you for your generous donation to ISKCON Juhu. Your contribution will help us continue our spiritual and community services.
                </p>
                
                {transactionDetails && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm font-medium">{transactionDetails.txnid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <div className="flex items-center font-semibold text-lg text-primary">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {parseInt(transactionDetails.amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-primary">
                  <h3 className="font-poppins font-semibold text-primary mb-2">What happens next?</h3>
                  <ul className="text-sm text-gray-700 space-y-1 text-left">
                    <li>• You will receive an email confirmation shortly</li>
                    <li>• A donation receipt will be sent within 24 hours</li>
                    <li>• Your contribution will be used for the specified purpose</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.print()}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Print Receipt
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
                
                <p className="text-xs text-gray-500">
                  For any queries regarding your donation, please contact us at donations@iskconjuhu.org
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PaymentSuccess;