import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, Wallet, Phone, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [, navigate] = useLocation();

  useEffect(() => {
    // Retrieve payment data from localStorage
    const storedData = localStorage.getItem('payuData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        
        // Ensure amount is stored as a number
        if (parsedData && parsedData.amount) {
          parsedData.amount = typeof parsedData.amount === 'number' 
            ? parsedData.amount 
            : parseFloat(String(parsedData.amount));
        }
        
        setPaymentData(parsedData);
      } catch (err) {
        console.error('Error parsing payment data:', err);
        setError('Invalid payment data. Please try again.');
      }
    } else {
      setError('No payment data found. Please try again.');
    }
  }, []);

  const handleSimulatePayment = (result: 'success' | 'failure') => {
    setIsProcessing(true);
    
    setTimeout(() => {
      if (!paymentData) return;
      
      // Build URL with parameters
      const params = new URLSearchParams();
      params.append('txnid', paymentData.txnid);
      params.append('amount', String(paymentData.amount));
      params.append('firstname', paymentData.firstname);
      params.append('email', paymentData.email);
      params.append('phone', paymentData.phone);
      params.append('status', result);
      params.append('paymentMethod', selectedPaymentMethod);
      
      if (result === 'failure') {
        params.append('error', 'Payment was declined or canceled');
      }
      
      // Clear the localStorage data
      localStorage.removeItem('payuData');
      
      // Redirect to appropriate page
      navigate(result === 'success' 
        ? `/donate/thank-you?${params.toString()}`
        : `/donate/payment-failed?${params.toString()}`);
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

      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/iskcon-logo.png" alt="ISKCON Logo" className="h-8 w-8" onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
              }} />
              <CardTitle>ISKCON Juhu</CardTitle>
            </div>
            <div className="rounded-full bg-white/20 px-3 py-1 text-sm">
              Payment Gateway
            </div>
          </div>
          <CardDescription className="text-primary-foreground/90">
            Complete your donation securely
          </CardDescription>
        </CardHeader>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-medium">{paymentData.txnid?.slice(0, 8)}...</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{paymentData.firstname}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="font-medium">{paymentData.productinfo}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between text-primary font-semibold">
                <span>Amount:</span>
                <span>₹{typeof paymentData.amount === 'number' ? paymentData.amount.toFixed(2) : parseFloat(String(paymentData.amount)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        
          <div className="md:w-2/3 p-4">
            {isProcessing ? (
              <div className="w-full py-16 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center text-lg">Processing your payment...</p>
                <p className="text-center text-sm text-muted-foreground mt-2">Please do not close this window</p>
              </div>
            ) : (
              <Tabs defaultValue="upi" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="upi" onClick={() => setSelectedPaymentMethod('upi')}>
                    <Phone className="h-4 w-4 mr-2" />
                    UPI
                  </TabsTrigger>
                  <TabsTrigger value="cards" onClick={() => setSelectedPaymentMethod('cards')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Cards
                  </TabsTrigger>
                  <TabsTrigger value="wallet" onClick={() => setSelectedPaymentMethod('wallet')}>
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet
                  </TabsTrigger>
                  <TabsTrigger value="netbanking" onClick={() => setSelectedPaymentMethod('netbanking')}>
                    <Globe className="h-4 w-4 mr-2" />
                    Net Banking
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upi" className="space-y-4">
                  <div className="p-3 border rounded-md bg-orange-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Test Payment Simulation</span>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Development Mode</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Since we're in development mode, you can simulate a payment to test the flow:
                    </p>
                    <div className="bg-white p-4 rounded mb-4">
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Select payment outcome:</p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="radio" id="payment-success" name="payment-result" value="success" defaultChecked 
                              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                            <label htmlFor="payment-success" className="ml-2 text-sm text-gray-700">Successful Payment</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="payment-failure" name="payment-result" value="failure"
                              className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                            <label htmlFor="payment-failure" className="ml-2 text-sm text-gray-700">Failed Payment</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        className="w-full bg-purple-700 hover:bg-purple-800"
                        onClick={() => {
                          const isSuccess = (document.getElementById('payment-success') as HTMLInputElement).checked;
                          handleSimulatePayment(isSuccess ? 'success' : 'failure');
                        }}
                      >
                        Simulate Payment
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cards" className="space-y-4">
                  <div className="p-4 border rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="mb-2 text-gray-600">Please use UPI tab for test payments</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-4">
                  <div className="p-4 border rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="mb-2 text-gray-600">Please use UPI tab for test payments</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="netbanking" className="space-y-4">
                  <div className="p-4 border rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="mb-2 text-gray-600">Please use UPI tab for test payments</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
        
        <CardFooter className="bg-gray-50 border-t p-4 text-xs text-center text-gray-500">
          <div className="w-full">
            <p>This is a payment simulation for testing purposes.</p>
            <p>In production, you would be redirected to the actual payment gateway.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentGateway;