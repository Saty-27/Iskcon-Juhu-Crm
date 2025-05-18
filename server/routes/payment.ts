import { Router, Request, Response } from 'express';
import crypto from 'crypto-js';
import { nanoid } from 'nanoid';
import { storage } from '../storage';

const router = Router();

// Initialize donation payment with PayU
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      amount, 
      message, 
      categoryId, 
      eventId,
      panCard,
      userId
    } = req.body;

    if (!name || !email || !phone || !amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    // Generate unique transaction ID
    const txnid = `TXN_${Date.now()}`;
    
    // Create donation record with pending status
    const donation = await storage.createDonation({
      email,
      name,
      phone,
      amount: Number(amount),
      message: message || null,
      panCard: panCard || null,
      status: 'pending',
      userId: userId || req.session?.userId || null,
      categoryId: categoryId ? Number(categoryId) : null,
      eventId: eventId ? Number(eventId) : null,
      paymentId: txnid,
      createdAt: new Date()
    });

    // Generate PayU hash
    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    
    if (!key || !salt) {
      return res.status(500).json({ 
        success: false,
        message: 'Payment gateway configuration error' 
      });
    }
    
    const productinfo = 'Donation for ISKCON Juhu';
      
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${name}|${email}|||||||||||${salt}`;
    const hash = crypto.SHA512(hashString).toString();
    
    // PayU payment data
    const paymentData = {
      key,
      txnid,
      amount,
      productinfo,
      firstname: name,
      email,
      phone,
      surl: `${req.protocol}://${req.get('host')}/donate/thank-you`,
      furl: `${req.protocol}://${req.get('host')}/donate?status=failed`,
      hash,
      udf1: donation.id.toString() // Store donation ID for reference
    };
    
    res.status(200).json({
      success: true,
      paymentData,
      payuUrl: process.env.NODE_ENV === 'production' 
        ? 'https://secure.payu.in/_payment' 
        : 'https://sandboxsecure.payu.in/_payment'
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to initialize payment', 
      error: error.message 
    });
  }
});

// Handle successful payment callback
router.post('/success', async (req: Request, res: Response) => {
  try {
    const { txnid, status, amount, udf1, firstname, email, phone } = req.body;
    const donationId = Number(udf1);
    
    // Update donation status
    if (donationId) {
      await storage.updateDonation(donationId, {
        status: status.toLowerCase(),
        paymentId: txnid
      });
    }
    
    // Build query params for thank you page
    const params = new URLSearchParams();
    params.append('txnid', txnid);
    params.append('amount', amount);
    params.append('status', 'success');
    
    if (firstname) params.append('firstname', firstname);
    if (email) params.append('email', email);
    if (phone) params.append('phone', phone);
    
    // Redirect to thank you page
    return res.redirect(`/donate/thank-you?${params.toString()}`);
  } catch (error: any) {
    console.error('Payment success callback error:', error);
    return res.redirect('/donate?status=error');
  }
});

// Handle failed payment callback
router.post('/failure', async (req: Request, res: Response) => {
  try {
    const { txnid, status, error_Message, udf1 } = req.body;
    const donationId = Number(udf1);
    
    // Update donation status
    if (donationId) {
      await storage.updateDonation(donationId, {
        status: status?.toLowerCase() || 'failed',
        paymentId: txnid
      });
    }
    
    // Build query params for failure page
    const params = new URLSearchParams();
    params.append('status', 'failed');
    
    if (txnid) params.append('txnid', txnid);
    if (error_Message) params.append('message', error_Message);
    
    // Redirect to failure page
    return res.redirect(`/donate?${params.toString()}`);
  } catch (error: any) {
    console.error('Payment failure callback error:', error);
    return res.redirect('/donate?status=error');
  }
});

export default router;