module.exports = (sequelize, DataTypes) => {
  const MemberDocument = sequelize.define(
    'MemberDocument',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'members', key: 'id' },
      },
      kind: {
        // contractor_license | tax_certificate | trade_registry
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING(255),
      },
      mimeType: {
        type: DataTypes.STRING(100),
      },
      sizeBytes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      data: {
        // stored in Postgres as BYTEA
        type: DataTypes.BLOB,
        allowNull: false,
      },
      status: {
        // uploaded | approved | rejected | resubmit_required
        type: DataTypes.STRING(32),
        defaultValue: 'uploaded',
      },
      reviewerNote: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'member_documents',
      timestamps: true,
      underscored: true,
    }
  );

  return MemberDocument;
};

