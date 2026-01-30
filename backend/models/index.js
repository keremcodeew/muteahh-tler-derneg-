const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Varsayılan: SQLite. PostgreSQL: .env'de DATABASE_URL veya POSTGRES_URL (Vercel Postgres) tanımla.
const pgUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const usePostgres = pgUrl && pgUrl.startsWith('postgres');
const sequelize = usePostgres
  ? new Sequelize(pgUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: pgUrl.includes('sslmode') ? {} : { ssl: { require: true, rejectUnauthorized: false } },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'database.sqlite'),
      logging: false,
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.News = require('./News')(sequelize, Sequelize);
db.Announcement = require('./Announcement')(sequelize, Sequelize);
db.Member = require('./Member')(sequelize, Sequelize);

// Associations
db.User.hasOne(db.Member, { foreignKey: 'userId' });
db.Member.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
