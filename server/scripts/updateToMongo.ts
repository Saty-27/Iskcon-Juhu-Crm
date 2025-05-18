/**
 * Database Connection Update Script
 * 
 * This script updates the project to use MongoDB instead of PostgreSQL
 * Run with: npx tsx server/scripts/updateToMongo.ts
 */

import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    console.log('Updating application to use MongoDB...');
    
    // 1. Update server/index.ts to use MongoDB storage
    const indexPath = path.join(process.cwd(), 'server', 'index.ts');
    let indexContent = await fs.readFile(indexPath, 'utf8');
    
    // Replace storage import
    indexContent = indexContent.replace(
      `import { storage } from "./storage";`,
      `import { mongoStorage as storage } from "./mongoStorage";`
    );
    
    await fs.writeFile(indexPath, indexContent);
    console.log('Updated server/index.ts to use MongoDB storage');
    
    // 2. Update MongoDB configuration for sessions
    const replitAuthPath = path.join(process.cwd(), 'server', 'replitAuth.ts');
    
    try {
      const authFileExists = await fs.access(replitAuthPath).then(() => true).catch(() => false);
      
      if (authFileExists) {
        let authContent = await fs.readFile(replitAuthPath, 'utf8');
        
        // Replace PostgreSQL session store with MongoDB session store
        authContent = authContent.replace(
          `import connectPg from "connect-pg-simple";`,
          `import connectMongo from "connect-mongodb-session";`
        );
        
        authContent = authContent.replace(
          `const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });`,
          `const MongoDBStore = connectMongo(session);
  const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/iskconjuhu',
    collection: 'sessions',
    expires: sessionTtl,
  });
  
  // Handle connection errors
  sessionStore.on('error', function(error) {
    console.error('MongoDB session store error:', error);
  });`
        );
        
        await fs.writeFile(replitAuthPath, authContent);
        console.log('Updated server/replitAuth.ts to use MongoDB session store');
      }
    } catch (error) {
      console.log('No Replit Auth file found, skipping session store update');
    }
    
    // 3. Create .env.example with MongoDB connection string
    const envPath = path.join(process.cwd(), '.env.example');
    let envContent = await fs.readFile(envPath, 'utf8').catch(() => '');
    
    // Add MongoDB URI to environment variables
    if (!envContent.includes('MONGODB_URI')) {
      envContent += `\nMONGODB_URI=mongodb://localhost:27017/iskconjuhu\n`;
      await fs.writeFile(envPath, envContent);
      console.log('Updated .env.example with MongoDB connection string');
    }
    
    // 4. Create conversion instructions for production
    const readmePath = path.join(process.cwd(), 'MONGODB_SETUP.md');
    const readmeContent = `# MongoDB Migration Guide

## Setup Instructions

1. Install MongoDB on your PC:
   - Windows: Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Mac: \`brew install mongodb-community\`
   - Linux: Follow distribution-specific instructions

2. Configure Environment Variables:
   - Create a \`.env\` file in the project root
   - Add \`MONGODB_URI=mongodb://localhost:27017/iskconjuhu\` (or your MongoDB connection string)
   - Add other required environment variables (PayU, Twilio, etc.)

3. Migrate Data (if applicable):
   - Run \`npx tsx server/scripts/migrateToMongo.ts\` to transfer data from PostgreSQL
   - This requires both PostgreSQL and MongoDB to be running

4. Update Dependencies:
   - Run \`npm install connect-mongodb-session\` to add MongoDB session support

## Connection String Format

The MongoDB connection string format is:
\`\`\`
mongodb://[username:password@]host[:port]/database
\`\`\`

Example for local development:
\`\`\`
mongodb://localhost:27017/iskconjuhu
\`\`\`

Example for MongoDB Atlas:
\`\`\`
mongodb+srv://username:password@cluster.mongodb.net/iskconjuhu
\`\`\`

## Testing the Migration

After migrating, test these key features:
1. User authentication
2. Payment processing
3. Donation receipts via WhatsApp
4. Admin dashboard statistics

## Troubleshooting

Common issues:
- Connection errors: Check your MongoDB service is running
- Missing data: Ensure migration completed successfully
- Authentication errors: Verify your MongoDB connection string includes correct credentials

For additional help, contact the development team.
`;
    
    await fs.writeFile(readmePath, readmeContent);
    console.log('Created MONGODB_SETUP.md with migration instructions');
    
    console.log('MongoDB update completed successfully. Please follow the instructions in MONGODB_SETUP.md');
    
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);