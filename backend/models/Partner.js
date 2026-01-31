module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'Partner',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        // partner name
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      logoText: {
        // used in current UI as text-logo
        type: DataTypes.STRING(255),
      },
      logoUrl: {
        // optional future: show image instead of text
        type: DataTypes.STRING(500),
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'partners',
      timestamps: true,
      underscored: true,
    }
  );

  return Partner;
};

