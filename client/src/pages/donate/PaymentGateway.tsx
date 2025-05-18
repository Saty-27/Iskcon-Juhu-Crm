import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface PaymentData {
  txnid: string;
  amount: number;
  firstname: string;
  email: string;
  phone: string;
  productinfo: string;
  key: string;
}

const PaymentGateway = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Retrieve payment data from localStorage
    const storedData = localStorage.getItem('payuData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPaymentData(parsedData);
      } catch (err) {
        setError('Invalid payment data. Please try again.');
      }
    } else {
      setError('No payment data found. Please try again.');
    }
  }, []);

  const handleSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Build success URL with parameters
      const params = new URLSearchParams();
      if (paymentData) {
        params.append('txnid', paymentData.txnid);
        params.append('amount', String(paymentData.amount));
        params.append('firstname', paymentData.firstname);
        params.append('email', paymentData.email);
        params.append('phone', paymentData.phone);
        params.append('status', 'success');
      }
      
      // Clear the localStorage data
      localStorage.removeItem('payuData');
      
      // Redirect to thank you page
      navigate(`/donate/thank-you?${params.toString()}`);
    }, 2000);
  };

  const handleFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Build failure URL with parameters
      const params = new URLSearchParams();
      if (paymentData) {
        params.append('txnid', paymentData.txnid);
        params.append('amount', String(paymentData.amount));
        params.append('firstname', paymentData.firstname);
        params.append('email', paymentData.email);
        params.append('phone', paymentData.phone);
        params.append('status', 'failure');
        params.append('error', 'Payment was declined by user');
      }
      
      // Clear the localStorage data
      localStorage.removeItem('payuData');
      
      // Redirect to failure page
      navigate(`/donate/payment-failed?${params.toString()}`);
    }, 1500);
  };

  const handleCancel = () => {
    localStorage.removeItem('payuData');
    navigate('/donate');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Error</CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/donate')}>Return to Donation Page</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Payment Gateway | ISKCON Juhu</title>
        <meta name="description" content="Secure payment gateway for ISKCON Juhu donations" />
      </Helmet>

      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <CardTitle>PayU Payment Gateway</CardTitle>
            <div className="rounded-full bg-white/20 px-3 py-1 text-sm">
              Test Mode
            </div>
          </div>
          <CardDescription className="text-primary-foreground/90">
            Please review your donation details
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-medium">{paymentData.txnid}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{paymentData.firstname}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{paymentData.email}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{paymentData.phone}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Purpose:</span>
              <span className="font-medium">{paymentData.productinfo}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Amount:</span>
              <span>₹{paymentData.amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          {isProcessing ? (
            <div className="w-full py-4 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-center text-muted-foreground">Processing your payment...</p>
            </div>
          ) : (
            <>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={handleSuccess}
              >
                Pay ₹{paymentData.amount.toFixed(2)}
              </Button>
              
              <div className="flex w-full gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleFailure}
                >
                  Decline
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
          
          <div className="w-full text-center text-xs text-muted-foreground mt-2">
            <p>This is a payment simulation for testing purposes.</p>
            <p>In production, you would be redirected to the actual PayU gateway.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentGateway;