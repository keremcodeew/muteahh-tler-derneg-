module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      dateText: {
        // e.g. "02 Şubat 2026" (display)
        type: DataTypes.STRING(100),
      },
      eventDate: {
        // YYYY-MM-DD for sorting/filtering
        type: DataTypes.DATEONLY,
      },
      location: {
        type: DataTypes.STRING(255),
      },
      color: {
        // burgundy | green | blue
        type: DataTypes.STRING(32),
        defaultValue: 'burgundy',
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'events',
      timestamps: true,
      underscored: true,
    }
  );

  return Event;
};

