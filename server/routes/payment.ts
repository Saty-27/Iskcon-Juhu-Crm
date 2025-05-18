import express from 'express';
import { payuConfig, generateHash, getPaymentFormData } from '../services/payuService';
import { storage } from '../storage';
import { nanoid } from 'nanoid';

const router = express.Router();

// Initialize PayU payment
router.post('/initiate', async (req, res) => {
  try {
    const {
      amount,
      name,
      email,
      phone,
      message,
      categoryId, 
      eventId,
      panCard,
      paymentMethod = 'netbanking' // Default payment method
    } = req.body;
    
    if (!amount || !name || !email || !phone) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required payment fields' 
      });
    }
    
    // Generate transaction ID
    const txnid = `ISKCON_${nanoid(8)}`;
    
    // Determine success and failure URLs
    const baseUrl = `${req.protocol}://${req.hostname}`;
    
    // In production, these would be full URLs that PayU would redirect to after payment
    const surl = `${baseUrl}/api/payments/success`; 
    const furl = `${baseUrl}/api/payments/failure`;
    
    // Product info description
    const categoryName = categoryId ? 'Temple Donation' : 'General Donation';
    const productinfo = `Donation for ISKCON Juhu - ${categoryName}`;
    
    // Prepare payment request for PayU
    const paymentRequest = {
      txnid,
      amount: Number(amount),
      productinfo,
      firstname: name,
      email,
      phone,
      surl,
      furl,
      // Include UPI specific fields if UPI payment method is selected
      ...(paymentMethod === 'upi' && {
        udf1: 'upi', // Use UDF fields to pass payment method info
        pg: 'UPI'    // Payment gateway - UPI
      })
    };
    
    // Get PayU form data with hash
    const { formUrl, formData } = getPaymentFormData(paymentRequest);
    
    // Store donation in database
    await storage.createDonation({
      email,
      name,
      phone,
      amount: Number(amount),
      message: message || null,
      status: 'pending',
      categoryId: categoryId ? Number(categoryId) : null,
      eventId: eventId ? Number(eventId) : null,
      panCard: panCard || null,
      userId: req.user?.id || null,
      paymentId: txnid
    });
    
    // Return payment data and URL for the frontend to create and submit form
    res.json({
      success: true,
      txnid,
      payuUrl: formUrl,
      paymentData: formData,
      // Include UPI data if UPI is selected
      ...(paymentMethod === 'upi' && {
        upiData: {
          payeeVpa: 'iskcon@hdfcbank', // Replace with your actual UPI VPA
          payeeName: 'ISKCON Juhu',
          amount: Number(amount),
          transactionId: txnid,
          transactionNote: productinfo
        }
      })
    });
  } catch (error) {
    console.error('PayU payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initialization failed'
    });
  }
});

// Handle PayU success callback
router.post('/success', async (req, res) => {
  try {
    const paymentResponse = req.body;
    
    // Update donation status to completed
    if (paymentResponse && paymentResponse.txnid) {
      const donation = await storage.getDonationByPaymentId(paymentResponse.txnid);
      
      if (donation) {
        await storage.updateDonation(donation.id, {
          status: 'completed',
          paymentId: paymentResponse.mihpayid || paymentResponse.txnid
        });
      }
    }
    
    // Redirect to thank you page with parameters
    const params = new URLSearchParams({
      txnid: paymentResponse.txnid || '',
      amount: paymentResponse.amount || '',
      firstname: paymentResponse.firstname || '',
      email: paymentResponse.email || '',
      status: 'success'
    });
    
    res.redirect(`/donate/thank-you?${params.toString()}`);
  } catch (error) {
    console.error('PayU success callback error:', error);
    res.redirect('/donate/payment-failed');
  }
});

// Handle PayU failure callback
router.post('/failure', async (req, res) => {
  try {
    const paymentResponse = req.body;
    
    // Update donation status to failed
    if (paymentResponse && paymentResponse.txnid) {
      const donation = await storage.getDonationByPaymentId(paymentResponse.txnid);
      
      if (donation) {
        await storage.updateDonation(donation.id, {
          status: 'failed'
        });
      }
    }
    
    // Redirect to failure page with parameters
    const params = new URLSearchParams({
      txnid: paymentResponse.txnid || '',
      amount: paymentResponse.amount || '',
      firstname: paymentResponse.firstname || '',
      email: paymentResponse.email || '',
      status: 'failure',
      error: paymentResponse.error_Message || 'Payment failed'
    });
    
    res.redirect(`/donate/payment-failed?${params.toString()}`);
  } catch (error) {
    console.error('PayU failure callback error:', error);
    res.redirect('/donate/payment-failed');
  }
});

// API endpoint to initiate UPI payment directly
router.post('/upi-intent', async (req, res) => {
  try {
    const { upiId, txnid, amount } = req.body;
    
    if (!upiId || !txnid || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required UPI fields'
      });
    }
    
    // Create UPI payment intent URL
    // Format: upi://pay?pa=PAYEE_VPA&pn=PAYEE_NAME&am=AMOUNT&tr=TRANSACTION_ID&tn=TRANSACTION_NOTE
    const upiIntent = `upi://pay?pa=iskcon@hdfcbank&pn=ISKCON+Juhu&am=${amount}&tr=${txnid}&tn=Donation+to+ISKCON+Juhu`;
    
    res.json({
      success: true,
      upiIntent,
      txnid
    });
  } catch (error) {
    console.error('UPI intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create UPI payment intent'
    });
  }
});

export default router;