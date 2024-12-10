module.exports = (sequelize, DataTypes) => {
  const SalePoint = sequelize.define(
    "sale_point",
    {
      shopID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      nameShop: {
        type: DataTypes.STRING,
      },
      staffSupport: {
        type: DataTypes.STRING,
      },
      personalID: {
        type: DataTypes.STRING,
      },
      staffCode: {
        type: DataTypes.STRING,
      },
      shopCode: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      province: {
        type: DataTypes.STRING,
      },
      district: {
        type: DataTypes.STRING,
      },
      ward: {
        type: DataTypes.STRING,
      },
      provinceCode: {
        type: DataTypes.STRING,
      },
      districtCode: {
        type: DataTypes.STRING,
      },
      wardCode: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.TEXT,
      },
      latitude: {
        type: DataTypes.TEXT,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return SalePoint;
};
