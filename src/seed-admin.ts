/**
 * One-time script to create the first admin account.
 * Run with: npm run seed:admin
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from .env
 */
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserSchema } from './users/user.schema';

async function run() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!uri || !email || !password) {
    console.error('Missing MONGODB_URI / SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const UserModel = mongoose.model('User', UserSchema);

  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin account already exists for ${email}. Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await UserModel.create({
    email: email.toLowerCase(),
    passwordHash,
    fullName: 'Administrateur Vakpon Tours',
    role: 'admin',
  });

  console.log(`Admin account created: ${email}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
