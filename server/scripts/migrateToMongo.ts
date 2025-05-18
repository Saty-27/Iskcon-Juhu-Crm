/**
 * Database Migration Script
 * 
 * This script migrates data from PostgreSQL to MongoDB
 * Run with: npx tsx server/scripts/migrateToMongo.ts
 */

import { pool, db } from '../db';
import { connectToMongoDB } from '../mongodb';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('Starting PostgreSQL to MongoDB migration...');
    
    // Connect to MongoDB
    const { client, db: mongoDB } = await connectToMongoDB();
    console.log('Connected to MongoDB');
    
    // Array of tables to migrate
    const tables = [
      'users',
      'banners',
      'quotes',
      'donation_categories',
      'events',
      'gallery',
      'videos',
      'testimonials',
      'contact_messages',
      'social_links',
      'donations',
      'subscriptions'
    ];
    
    // Migrate each table
    for (const table of tables) {
      console.log(`Migrating table: ${table}`);
      
      // Get PostgreSQL data
      const pgData = await db.query.table(table).execute();
      console.log(`Found ${pgData.length} records in PostgreSQL ${table}`);
      
      if (pgData.length === 0) {
        console.log(`No data to migrate for ${table}. Skipping...`);
        continue;
      }
      
      // Transform data for MongoDB
      const mongoData = pgData.map(record => {
        // Convert PostgreSQL snake_case columns to camelCase for MongoDB
        const transformed = {};
        
        for (const key in record) {
          if (Object.prototype.hasOwnProperty.call(record, key)) {
            // Skip the id field as MongoDB will generate its own _id
            if (key === 'id') continue;
            
            // Convert snake_case to camelCase
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            transformed[camelKey] = record[key];
          }
        }
        
        // Add MongoDB _id field
        transformed['_id'] = new ObjectId();
        
        // Handle foreign keys by storing the original ID for reference
        if (record.user_id) transformed['originalUserId'] = record.user_id;
        if (record.category_id) transformed['originalCategoryId'] = record.category_id;
        if (record.event_id) transformed['originalEventId'] = record.event_id;
        
        return transformed;
      });
      
      // Create collection name (singular form)
      const collectionName = table.endsWith('s') ? table : `${table}s`;
      
      // Insert into MongoDB
      if (mongoData.length > 0) {
        const result = await mongoDB.collection(collectionName).insertMany(mongoData);
        console.log(`Inserted ${result.insertedCount} records into MongoDB ${collectionName}`);
      }
    }
    
    // Create a mapping collection for future reference
    const idMappings = {};
    for (const table of tables) {
      const pgData = await db.query.table(table).execute();
      const mongoCollection = mongoDB.collection(table.endsWith('s') ? table : `${table}s`);
      
      for (const record of pgData) {
        const mongoRecord = await mongoCollection.findOne({
          // Find by unique identifiers other than ID
          // This is a simplification - you might need more complex logic
          ...(record.email ? { email: record.email } : {}),
          ...(record.name ? { name: record.name } : {}),
          ...(record.title ? { title: record.title } : {})
        });
        
        if (mongoRecord) {
          if (!idMappings[table]) idMappings[table] = {};
          idMappings[table][record.id] = mongoRecord._id.toString();
        }
      }
    }
    
    // Store ID mappings for reference
    await mongoDB.collection('idMappings').insertOne({ mappings: idMappings });
    console.log('Created ID mappings collection for reference');
    
    console.log('Migration completed successfully');
    
    // Close connections
    await client.close();
    await pool.end();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);