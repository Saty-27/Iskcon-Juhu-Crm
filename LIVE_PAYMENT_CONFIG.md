# Live Payment Configuration Guide

## Payment System Status: LIVE MODE ENABLED

The payment system has been configured to use live payment gateways for production transactions.

### PayU Configuration (LIVE)
- **Base URL**: `https://secure.payu.in`
- **Payment URL**: `https://secure.payu.in/_payment`
- **Mode**: Production/Live
- **Required Environment Variables**:
  - `PAYU_MERCHANT_KEY`: Your live PayU merchant key
  - `PAYU_MERCHANT_SALT`: Your live PayU merchant salt

### UPI Configuration (LIVE)
- **UPI ID**: `iskconjuhu@sbi`
- **Payee Name**: ISKCON Juhu
- **Currency**: INR
- **Mode**: Live transactions

### WhatsApp Notifications (LIVE)
- **Service**: Twilio WhatsApp Business API
- **Required Environment Variables**:
  - `TWILIO_ACCOUNT_SID`: Your Twilio account SID
  - `TWILIO_AUTH_TOKEN`: Your Twilio auth token
  - `TWILIO_PHONE_NUMBER`: Your verified Twilio WhatsApp number

### Important Notes for Live Mode

1. **PayU Merchant Account**: Ensure you have a live PayU merchant account with proper KYC verification
2. **Bank Account**: Live PayU account must be linked to a verified bank account for settlement
3. **SSL Certificate**: Website must have valid SSL certificate for secure payments
4. **Webhook URLs**: Payment callback URLs are configured for your domain
5. **Testing**: Test thoroughly with small amounts before going live
6. **Compliance**: Ensure compliance with RBI guidelines for online payments

### Payment Flow (Live Mode)
1. User initiates donation on website
2. Payment request sent to live PayU gateway
3. User redirected to PayU payment page
4. Payment processed through live banking channels
5. Success/failure callback received
6. Donation status updated in database
7. WhatsApp notification sent to donor
8. PDF receipt generated and stored

### Security Features
- Hash-based payment verification
- Secure callback handling
- Transaction ID generation
- Payment amount validation
- User data encryption

### Monitoring & Support
- All transactions logged in database
- Failed payment notifications via WhatsApp
- Admin dashboard for payment monitoring
- Automatic receipt generation