# MongoDB Migration Guide for ISKCON Juhu Website

This guide will help you migrate your ISKCON Juhu website from PostgreSQL to MongoDB.

## Step 1: Set Up MongoDB

### Local Development Environment
1. Install MongoDB Community Edition:
   - **Windows**: Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Mac**: `brew install mongodb-community`
   - **Linux**: Follow your distribution's specific instructions

2. Start MongoDB service:
   - **Windows**: MongoDB should run as a service automatically
   - **Mac/Linux**: `sudo systemctl start mongod` or `brew services start mongodb-community`

3. Verify MongoDB is running:
   ```
   mongosh
   ```

### Production Environment
For production, you can use:
- MongoDB Atlas (cloud-hosted)
- Self-hosted MongoDB server

## Step 2: Update Environment Variables

Create or update your `.env` file with MongoDB connection details:

```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/iskconjuhu

# Keep existing variables
PAYU_MERCHANT_KEY=your_payu_key
PAYU_MERCHANT_SALT=your_payu_salt
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

For MongoDB Atlas, your connection string will look like:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iskconjuhu
```

## Step 3: Install Required Dependencies

```bash
npm install mongodb connect-mongodb-session dotenv
```

## Step 4: Run the Migration Scripts

The repository includes two scripts to help you migrate:

1. First, run the script to update the application to use MongoDB:
   ```bash
   npx tsx server/scripts/updateToMongo.ts
   ```

2. Then, if you have existing PostgreSQL data to migrate:
   ```bash
   npx tsx server/scripts/migrateToMongo.ts
   ```

## Step 5: Verify the Migration

1. Start the application:
   ```bash
   npm run dev
   ```

2. Test the following functionality:
   - User login/registration
   - Content management in admin panel
   - Donation process including PayU and UPI options
   - WhatsApp notification system for both successful and failed payments

## Troubleshooting

### Connection Issues
- Verify MongoDB is running: `mongosh`
- Check connection string format is correct
- Ensure network allows MongoDB connections (especially in production)

### Data Migration Issues
- If specific data is missing, check MongoDB collections directly
- Use MongoDB Compass for visual inspection of the database

### Application Errors
- Check server logs for MongoDB-specific errors
- Verify all collections are created correctly

## MongoDB Data Structure

After migration, your data will be organized into these collections:

- `users`: User accounts including admin users
- `donations`: Donation records
- `donationCategories`: Categories for donations
- `events`: Temple events
- `banners`: Website banners
- `gallery`: Photo gallery items
- `videos`: Video gallery items
- `quotes`: Spiritual quotes
- `testimonials`: User testimonials
- `contactMessages`: Messages from the contact form
- `socialLinks`: Social media links
- `subscriptions`: Newsletter subscriptions
- `sessions`: User sessions (if using MongoDB session store)

## Support

If you encounter any issues during migration, please contact the development team for assistance.