require('dotenv').config();
const db = require('../models');

db.sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    console.log('Database synced.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
