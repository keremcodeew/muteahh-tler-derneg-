require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../models');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@muteahhitler.org';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });
    const existing = await db.User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log('Admin user already exists.');
      process.exit(0);
      return;
    }
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = await db.User.create({
      email: ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
    });
    await db.Member.create({
      userId: user.id,
      name: 'Site Admin',
      email: ADMIN_EMAIL,
      company: 'Müteahhitler Derneği',
      role: 'Admin',
      joinDate: new Date().toISOString().split('T')[0],
      isApproved: true,
    });
    console.log('Admin created:', ADMIN_EMAIL);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
