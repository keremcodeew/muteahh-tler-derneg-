const { Sequelize } = require('sequelize');
require('dotenv').config();

// Postgres-only (Vercel Postgres / managed Postgres)
let pgUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!pgUrl || !pgUrl.startsWith('postgres')) {
  throw new Error(
    'PostgreSQL connection string is required. Please set DATABASE_URL (or POSTGRES_URL) to a postgres:// URL.'
  );
}

// Some managed Postgres providers add sslmode=require in the URL query.
// pg-connection-string currently treats some sslmodes as verify-full; we prefer explicit ssl config.
try {
  const u = new URL(pgUrl);
  if (u.searchParams.has('sslmode')) {
    u.searchParams.delete('sslmode');
    pgUrl = u.toString();
  }
} catch {
  // If URL parsing fails, keep original string.
}

const needsSsl = !pgUrl.includes('localhost') && !pgUrl.includes('127.0.0.1');

const sequelize = new Sequelize(pgUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: needsSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  pool: {
    // serverless-friendly defaults
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.News = require('./News')(sequelize, Sequelize);
db.Announcement = require('./Announcement')(sequelize, Sequelize);
db.Member = require('./Member')(sequelize, Sequelize);
db.HeroSlide = require('./HeroSlide')(sequelize, Sequelize);
db.Video = require('./Video')(sequelize, Sequelize);
db.Publication = require('./Publication')(sequelize, Sequelize);
db.PageContent = require('./PageContent')(sequelize, Sequelize);
db.Event = require('./Event')(sequelize, Sequelize);
db.Partner = require('./Partner')(sequelize, Sequelize);
db.MemberDocument = require('./MemberDocument')(sequelize, Sequelize);
db.SmsFeedback = require('./SmsFeedback')(sequelize, Sequelize);

// Associations
db.User.hasOne(db.Member, { foreignKey: 'userId' });
db.Member.belongsTo(db.User, { foreignKey: 'userId' });
db.Member.hasMany(db.MemberDocument, { foreignKey: 'memberId', as: 'documents' });
db.MemberDocument.belongsTo(db.Member, { foreignKey: 'memberId' });

module.exports = db;
