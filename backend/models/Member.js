module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.STRING(255),
    },
    profileImageUrl: {
      type: DataTypes.STRING(500),
    },
    joinDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationStatus: {
      // pending_docs | under_review | resubmit_required | rejected | approved
      type: DataTypes.STRING(32),
      defaultValue: 'pending_docs',
    },
    verificationNote: {
      type: DataTypes.TEXT,
    },
    phoneCountryCode: {
      type: DataTypes.STRING(8),
    },
    phoneNumber: {
      type: DataTypes.STRING(32),
    },
    phoneE164: {
      type: DataTypes.STRING(32),
    },
    kvkkAcceptedAt: {
      type: DataTypes.DATE,
    },
    termsAcceptedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'members',
    timestamps: true,
    underscored: true,
  });
  return Member;
};
