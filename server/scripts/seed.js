require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set. Create a .env file in server/ first.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ googleId: 'seed-provider-001' });
  if (existing) {
    console.log('Seed provider already exists:', existing.email);
    await mongoose.disconnect();
    return;
  }

  const provider = await User.create({
    googleId:  'seed-provider-001',
    name:      'Ravi Kumar',
    email:     'ravi.provider@riderun.test',
    picture:   '',
    role:      'provider',
    isOnline:  false,
  });

  console.log('Seed provider created:', provider.email);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
