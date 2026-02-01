module.exports = (sequelize, DataTypes) => {
  const PageContent = sequelize.define(
    'PageContent',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slug: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      heroTitle: {
        type: DataTypes.STRING(255),
      },
      heroSubtitle: {
        type: DataTypes.STRING(500),
      },
      aboutTitle: {
        type: DataTypes.STRING(255),
      },
      aboutParagraph1: {
        type: DataTypes.TEXT,
      },
      aboutParagraph2: {
        type: DataTypes.TEXT,
      },
      aboutPdfTitle: {
        type: DataTypes.STRING(255),
      },
      aboutPdfUrl: {
        type: DataTypes.STRING(500),
      },
      quickInfo: {
        // newline-separated bullet lines
        type: DataTypes.TEXT,
      },
      mission: {
        type: DataTypes.TEXT,
      },
      vision: {
        type: DataTypes.TEXT,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'page_contents',
      timestamps: true,
      underscored: true,
    }
  );

  return PageContent;
};

