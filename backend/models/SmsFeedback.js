module.exports = (sequelize, DataTypes) => {
  const SmsFeedback = sequelize.define(
    'SmsFeedback',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phoneE164: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
      },
      email: {
        type: DataTypes.STRING(255),
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING(64),
        defaultValue: 'web',
      },
      status: {
        type: DataTypes.STRING(32),
        defaultValue: 'new',
      },
    },
    {
      tableName: 'sms_feedback',
      timestamps: true,
      underscored: true,
    }
  );
  return SmsFeedback;
};

