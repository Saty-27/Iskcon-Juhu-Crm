import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, Wallet, Phone, Globe, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
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
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }
    
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
        params.append('paymentMethod', selectedPaymentMethod);
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
              PayU Gateway
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
                <span>₹{paymentData.amount.toFixed(2)}</span>
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
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <span className="bg-green-100 rounded-full p-1 mr-2">
                        <Phone className="h-5 w-5 text-green-600" />
                      </span>
                      <div>
                        <p className="font-medium">Pay using UPI</p>
                        <p className="text-xs text-muted-foreground">Google Pay, PhonePe, BHIM, Paytm</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600">₹15 Cashback</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/03/Paytm_Logo.png" 
                           alt="Paytm" className="h-6 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">Paytm</span>
                    </div>
                    <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/03/PhonePe_Logo.png" 
                           alt="PhonePe" className="h-6 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">PhonePe</span>
                    </div>
                    <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/03/Google_Pay_Logo.png" 
                           alt="Google Pay" className="h-6 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">Google Pay</span>
                    </div>
                    <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/03/BHIM_Logo.png" 
                           alt="BHIM" className="h-6 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">BHIM</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Enter UPI ID</span>
                      <span className="text-xs text-primary">What is UPI ID?</span>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        type="text" 
                        placeholder="yourname@upi" 
                        className="flex-1"
                        id="upi-id-input"
                        defaultValue="sg639502@oksbi" 
                      />
                      <Button 
                        type="button" 
                        className="whitespace-nowrap bg-purple-700 hover:bg-purple-800"
                        onClick={async () => {
                          const upiId = (document.getElementById('upi-id-input') as HTMLInputElement)?.value;
                          
                          if (!upiId) {
                            alert('Please enter a valid UPI ID');
                            return;
                          }
                          
                          setIsProcessing(true);
                          
                          try {
                            // Create UPI payment intent with the backend
                            const response = await fetch('/api/payments/upi-intent', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                upiId,
                                txnid: paymentData?.txnid,
                                amount: paymentData?.amount
                              }),
                            });
                            
                            const result = await response.json();
                            
                            if (result.success && result.upiIntent) {
                              // On desktop, show QR code for UPI payment
                              if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                                // Show QR code modal for UPI intent
                                const modalElement = document.createElement('div');
                                modalElement.id = 'upi-qr-modal';
                                modalElement.style.position = 'fixed';
                                modalElement.style.top = '0';
                                modalElement.style.left = '0';
                                modalElement.style.right = '0';
                                modalElement.style.bottom = '0';
                                modalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                                modalElement.style.display = 'flex';
                                modalElement.style.alignItems = 'center';
                                modalElement.style.justifyContent = 'center';
                                modalElement.style.zIndex = '9999';
                                
                                const content = document.createElement('div');
                                content.style.width = '350px';
                                content.style.maxWidth = '90%';
                                content.style.backgroundColor = 'white';
                                content.style.borderRadius = '12px';
                                content.style.padding = '20px';
                                
                                content.innerHTML = `
                                  <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                                    <div style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">Scan QR Code to Pay</div>
                                    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px; background-color: #f9f9f9;">
                                      <img 
                                        src="${result.qrCodeData}"
                                        alt="UPI QR Code"
                                        style="width: 200px; height: 200px;"
                                      />
                                    </div>
                                    <div style="margin-bottom: 5px; font-weight: 500;">Pay to ISKCON Juhu</div>
                                    <div style="margin-bottom: 10px; font-size: 20px; font-weight: bold; color: #5a189a;">₹${paymentData?.amount.toFixed(2)}</div>
                                    <div style="margin-bottom: 10px; color: #666; font-size: 14px;">UPI ID: iskcon@hdfcbank</div>
                                    <div style="margin-bottom: 15px; color: #888; font-size: 12px;">Scan with any UPI app: Google Pay, PhonePe, Paytm, etc.</div>
                                    <div style="display: flex; width: 100%; gap: 10px;">
                                      <button id="cancel-qr-btn" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 6px; background-color: #f5f5f5; cursor: pointer;">Cancel</button>
                                      <button id="payment-completed-btn" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background-color: #5a189a; color: white; cursor: pointer;">Payment Completed</button>
                                    </div>
                                  </div>
                                `;
                                
                                modalElement.appendChild(content);
                                document.body.appendChild(modalElement);
                                
                                // Add event listeners
                                document.getElementById('payment-completed-btn')?.addEventListener('click', () => {
                                  document.body.removeChild(modalElement);
                                  handleSuccess();
                                });
                                
                                document.getElementById('cancel-qr-btn')?.addEventListener('click', () => {
                                  document.body.removeChild(modalElement);
                                  setIsProcessing(false);
                                });
                              } else {
                                // On mobile, try to open UPI app directly
                                window.location.href = result.upiIntent;
                                
                                // Set a timer to check if payment completed
                                setTimeout(() => {
                                  // Show payment verification dialog 
                                  const verifyModalElement = document.createElement('div');
                                  verifyModalElement.id = 'upi-verify-modal';
                                  verifyModalElement.style.position = 'fixed';
                                  verifyModalElement.style.top = '0';
                                  verifyModalElement.style.left = '0';
                                  verifyModalElement.style.right = '0';
                                  verifyModalElement.style.bottom = '0';
                                  verifyModalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                                  verifyModalElement.style.display = 'flex';
                                  verifyModalElement.style.alignItems = 'center';
                                  verifyModalElement.style.justifyContent = 'center';
                                  verifyModalElement.style.zIndex = '9999';
                                  
                                  const verifyContent = document.createElement('div');
                                  verifyContent.style.width = '300px';
                                  verifyContent.style.maxWidth = '90%';
                                  verifyContent.style.backgroundColor = 'white';
                                  verifyContent.style.borderRadius = '12px';
                                  verifyContent.style.padding = '20px';
                                  
                                  verifyContent.innerHTML = `
                                    <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                                      <div style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">Payment Verification</div>
                                      <div style="margin-bottom: 20px; color: #666; font-size: 14px;">
                                        Did you complete the payment in your UPI app?
                                      </div>
                                      <div style="display: flex; width: 100%; gap: 10px;">
                                        <button id="payment-failed-btn" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 6px; background-color: #f5f5f5; cursor: pointer;">No, Failed</button>
                                        <button id="payment-success-btn" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background-color: #5a189a; color: white; cursor: pointer;">Yes, Completed</button>
                                      </div>
                                    </div>
                                  `;
                                  
                                  verifyModalElement.appendChild(verifyContent);
                                  document.body.appendChild(verifyModalElement);
                                  
                                  // Add event listeners
                                  document.getElementById('payment-success-btn')?.addEventListener('click', async () => {
                                    // Show loading indicator
                                    document.getElementById('payment-success-btn').innerHTML = 'Verifying...';
                                    document.getElementById('payment-failed-btn').disabled = true;
                                    
                                    try {
                                      // Verify payment status with server
                                      const verifyResponse = await fetch('/api/payments/verify-upi', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          txnid: paymentData?.txnid
                                        }),
                                      });
                                      
                                      const verifyResult = await verifyResponse.json();
                                      
                                      if (verifyResult.success) {
                                        document.body.removeChild(verifyModalElement);
                                        handleSuccess();
                                      } else {
                                        alert('Payment verification failed: ' + verifyResult.message);
                                        document.body.removeChild(verifyModalElement);
                                        setIsProcessing(false);
                                      }
                                    } catch (error) {
                                      console.error('Payment verification error:', error);
                                      alert('Failed to verify payment. Please contact support with your transaction ID.');
                                      document.body.removeChild(verifyModalElement);
                                      setIsProcessing(false);
                                    }
                                  });
                                  
                                  document.getElementById('payment-failed-btn')?.addEventListener('click', () => {
                                    document.body.removeChild(verifyModalElement);
                                    setIsProcessing(false);
                                  });
                                }, 5000);
                              }
                            } else {
                              throw new Error(result.message || 'Failed to create UPI payment intent');
                            }
                          } catch (error) {
                            console.error('UPI payment error:', error);
                            setIsProcessing(false);
                            alert('Failed to initialize UPI payment. Please try again.');
                          }
                        }}
                      >
                        Verify & Pay
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Example: mobilenumber@upi, username@bank</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="cards" className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-3">Add New Card</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input type="text" id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Label htmlFor="expiry">Valid Thru (MM/YY)</Label>
                          <Input type="text" id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="w-1/3">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input type="text" id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="name">Name on Card</Label>
                        <Input type="text" id="name" placeholder="John Doe" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                         alt="Mastercard" className="h-6"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.onerror = null;
                           target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                         }} />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" 
                         alt="Visa" className="h-6"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.onerror = null;
                           target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                         }} />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" 
                         alt="American Express" className="h-6"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.onerror = null;
                           target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                         }} />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/RuPay.svg/1200px-RuPay.svg.png" 
                         alt="RuPay" className="h-6"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.onerror = null;
                           target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                         }} />
                  </div>
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-4">
                  <RadioGroup defaultValue="mobikwik">
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value="mobikwik" id="mobikwik" />
                      <Label htmlFor="mobikwik" className="flex items-center gap-2">
                        <img src="https://1000logos.net/wp-content/uploads/2021/03/MobiKwik_Logo.png" 
                             alt="MobiKwik" className="h-6"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.onerror = null;
                               target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                             }} />
                        <span>MobiKwik Wallet</span>
                        <span className="text-xs text-green-600 ml-auto">₹50 Cashback</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 border rounded-md mt-2">
                      <RadioGroupItem value="paytm" id="paytm" />
                      <Label htmlFor="paytm" className="flex items-center gap-2">
                        <img src="https://1000logos.net/wp-content/uploads/2021/03/Paytm_Logo.png" 
                             alt="Paytm" className="h-6"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.onerror = null;
                               target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                             }} />
                        <span>Paytm Wallet</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 border rounded-md mt-2">
                      <RadioGroupItem value="amazonpay" id="amazonpay" />
                      <Label htmlFor="amazonpay" className="flex items-center gap-2">
                        <img src="https://1000logos.net/wp-content/uploads/2021/03/Amazon_Pay_Logo.png" 
                             alt="Amazon Pay" className="h-6"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.onerror = null;
                               target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                             }} />
                        <span>Amazon Pay</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
                
                <TabsContent value="netbanking" className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2018/03/SBI-Logo.png" 
                           alt="SBI" className="h-8 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">SBI</span>
                    </div>
                    <div className="flex flex-col items-center border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/05/HDFC-Bank-logo.png" 
                           alt="HDFC" className="h-8 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">HDFC</span>
                    </div>
                    <div className="flex flex-col items-center border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/05/ICICI-Bank-logo.png" 
                           alt="ICICI" className="h-8 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">ICICI</span>
                    </div>
                    <div className="flex flex-col items-center border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/05/Axis-Bank-logo.png" 
                           alt="Axis" className="h-8 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">Axis</span>
                    </div>
                    <div className="flex flex-col items-center border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/05/Kotak-Mahindra-Bank-logo.png" 
                           alt="Kotak" className="h-8 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">Kotak</span>
                    </div>
                    <div className="flex flex-col items-center border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                      <img src="https://1000logos.net/wp-content/uploads/2021/05/Yes-Bank-logo.png" 
                           alt="Yes Bank" className="h-8 object-contain mb-1"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null;
                             target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>';
                           }} />
                      <span className="text-xs">Yes Bank</span>
                    </div>
                  </div>
                  
                  <div className="p-2 border rounded-md mt-1">
                    <Label htmlFor="other-bank" className="text-sm mb-1 block">Other Banks</Label>
                    <select id="other-bank" className="w-full p-2 border rounded-md">
                      <option value="">Select your bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="boi">Bank of India</option>
                      <option value="canara">Canara Bank</option>
                      <option value="federal">Federal Bank</option>
                    </select>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
        
        <CardFooter className="justify-between flex-wrap gap-2 pt-0">
          {!isProcessing && (
            <>
              <div className="flex items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" 
                     alt="Secure" className="h-5"
                     onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.onerror = null;
                       target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
                     }} />
                <span className="text-xs text-muted-foreground">100% Secure Payment</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 px-6"
                  onClick={handleSuccess}
                  disabled={!selectedPaymentMethod}
                >
                  Pay ₹{paymentData.amount.toFixed(2)}
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