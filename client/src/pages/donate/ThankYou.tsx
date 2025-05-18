import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

// Transaction data type
interface TransactionData {
  txnid?: string;
  amount?: string;
  email?: string;
  firstname?: string;
  phone?: string;
  paymentMethod?: string;
  bankRefNum?: string;
  status?: string;
}

const ThankYou = () => {
  const [, setLocation] = useLocation();
  const [txnData, setTxnData] = useState<TransactionData>({});
  
  useEffect(() => {
    // Get transaction details from URL
    const params = new URLSearchParams(window.location.search);
    const txnid = params.get('txnid') || '';
    const amount = params.get('amount') || '';
    const email = params.get('email') || '';
    const firstname = params.get('firstname') || '';
    const phone = params.get('phone') || '';
    const paymentMethod = params.get('PG_TYPE') || '';
    const bankRefNum = params.get('bank_ref_num') || '';
    const status = params.get('status') || 'success';
    
    setTxnData({ 
      txnid, 
      amount, 
      email, 
      firstname, 
      phone, 
      paymentMethod, 
      bankRefNum,
      status
    });
    
    // If no transaction ID, redirect to donation page
    if (!txnid) {
      setLocation('/donate');
    }
  }, [setLocation]);
  
  // Failure component - when payment status is not success
  if (txnData.status && txnData.status !== 'success') {
    return (
      <>
        <Helmet>
          <title>Payment Failed - ISKCON Juhu</title>
          <meta 
            name="description" 
            content="Your donation payment to ISKCON Juhu was not successful. Please try again."
          />
        </Helmet>
        
        <div className="min-h-screen flex items-center justify-center bg-[#fff7e6] py-12 px-4">
          <div className="max-w-md w-full text-center">
            <img 
              src="https://iskconjuhu.in/ISKCON_logo.png" 
              alt="ISKCON Logo" 
              className="w-24 mx-auto mb-6"
            />
            
            <h1 className="font-poppins font-bold text-3xl text-[#d35400] mb-4">
              Payment Failed
            </h1>
            
            <p className="font-opensans text-gray-700 mb-8">
              We're sorry, but your donation payment could not be processed at this time. 
              Please try again or contact us if you continue to experience issues.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => setLocation('/')}
                className="bg-[#e67e22] hover:bg-[#c65f0c] text-white"
              >
                Return to Home
              </Button>
              
              <Button
                onClick={() => setLocation('/donate')}
                className="block w-full bg-white text-[#e67e22] border border-[#e67e22] hover:bg-[#fdf4e7]"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  // Success component
  return (
    <>
      <Helmet>
        <title>Thank You for Your Donation - ISKCON Juhu</title>
        <meta 
          name="description" 
          content="Thank you for your generous donation to ISKCON Juhu. Your contribution helps us maintain the temple and support our spiritual and community services."
        />
      </Helmet>
      
      <div 
        className="min-h-screen py-10 px-4"
        style={{
          background: 'linear-gradient(to bottom right, #fffaf0, #fceabb)',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
          <img 
            src="https://iskconjuhu.in/ISKCON_logo.png" 
            alt="ISKCON Logo" 
            className="w-28 mx-auto mb-6"
          />
          
          <h1 className="font-poppins font-bold text-2xl md:text-3xl text-[#d35400] mb-3">
            Hare Krishna, {txnData.firstname || 'Devotee'}!
          </h1>
          
          <p className="font-opensans text-gray-700 mb-8 max-w-lg mx-auto">
            Thank you for your kind donation towards Krishna's Prasadam distribution.
            <br />We are blessed to have your support.
          </p>
          
          <div className="bg-[#fdf4e7] border-l-4 border-[#e67e22] rounded-lg p-6 mb-8 text-left">
            <div className="grid gap-2">
              {txnData.email && (
                <div><span className="inline-block w-40 font-semibold">Email:</span> {txnData.email}</div>
              )}
              {txnData.phone && (
                <div><span className="inline-block w-40 font-semibold">Phone:</span> {txnData.phone}</div>
              )}
              {txnData.txnid && (
                <div><span className="inline-block w-40 font-semibold">Transaction ID:</span> {txnData.txnid}</div>
              )}
              {txnData.amount && (
                <div><span className="inline-block w-40 font-semibold">Amount Donated:</span> ₹{txnData.amount}</div>
              )}
              {txnData.paymentMethod && (
                <div><span className="inline-block w-40 font-semibold">Payment Method:</span> {txnData.paymentMethod}</div>
              )}
              {txnData.bankRefNum && (
                <div><span className="inline-block w-40 font-semibold">Bank Ref No.:</span> {txnData.bankRefNum}</div>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => setLocation('/')}
            className="bg-[#e67e22] hover:bg-[#c65f0c] text-white px-8 py-3 rounded-md"
          >
            ← Back to Home
          </Button>
          
          <img 
            src="https://iskconjuhu.in/Prabhupada_with_children.jpg" 
            alt="Srila Prabhupada" 
            className="w-full max-w-md mx-auto mt-8 rounded-lg shadow-md"
          />
        </div>
      </div>
    </>
  );
};

export default ThankYou;