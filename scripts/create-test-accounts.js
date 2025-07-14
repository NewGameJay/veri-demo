/**
 * Script to create test accounts for development
 */

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { users } });

async function createTestAccounts() {
  try {
    // Creator test account
    const creatorData = {
      username: 'Creator',
      email: 'creator@veri.club',
      password: 'VeriPass',
      firstName: 'Test',
      lastName: 'Creator',
      userType: 'creator',
      profileType: 'creator',
      veriScore: 75,
      xpPoints: 500,
      points: 100,
      streak: 5,
      hasCompletedOnboarding: true,
      profileCompleted: true,
      isVerified: true,
      bio: 'Test creator account for development and testing purposes.'
    };

    // Brand test account
    const brandData = {
      username: 'Brand',
      email: 'brand@veri.club',
      password: 'VeriPass',
      firstName: 'Test',
      lastName: 'Brand',
      userType: 'studio',
      profileType: 'studio',
      veriScore: 90,
      xpPoints: 1000,
      points: 500,
      streak: 10,
      hasCompletedOnboarding: true,
      profileCompleted: true,
      isVerified: true,
      bio: 'Test brand account for development and testing purposes.'
    };

    // Check if accounts already exist
    const existingCreator = await db.select().from(users).where(eq(users.email, creatorData.email));
    const existingBrand = await db.select().from(users).where(eq(users.email, brandData.email));

    // Create creator account if it doesn't exist
    if (existingCreator.length === 0) {
      const [creator] = await db.insert(users).values(creatorData).returning();
      console.log('✓ Created creator test account:', creator.username, '(ID:', creator.id + ')');
    } else {
      console.log('✓ Creator test account already exists');
    }

    // Create brand account if it doesn't exist
    if (existingBrand.length === 0) {
      const [brand] = await db.insert(users).values(brandData).returning();
      console.log('✓ Created brand test account:', brand.username, '(ID:', brand.id + ')');
    } else {
      console.log('✓ Brand test account already exists');
    }

    console.log('\nTest accounts ready:');
    console.log('Creator: creator@veri.club / VeriPass');
    console.log('Brand: brand@veri.club / VeriPass');

  } catch (error) {
    console.error('Error creating test accounts:', error);
  } finally {
    await pool.end();
  }
}

createTestAccounts();