require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../models');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set (required to seed platform_admin).');
}

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });
    const existing = await db.User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      if (existing.role !== 'platform_admin') {
        await existing.update({ role: 'platform_admin' });
        console.log('Admin upgraded to platform_admin:', ADMIN_EMAIL);
      } else {
        console.log('Admin user already exists.');
      }
      // Repair missing password hash (historical data)
      if (!existing.password) {
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await existing.update({ password: hashed });
        console.log('Admin password hash repaired.');
      }
      process.exit(0);
      return;
    }
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = await db.User.create({
      email: ADMIN_EMAIL,
      password: hashed,
      role: 'platform_admin',
    });
    await db.Member.create({
      userId: user.id,
      name: 'Site Admin',
      email: ADMIN_EMAIL,
      company: 'Antalya Müteahhitler Derneği',
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
