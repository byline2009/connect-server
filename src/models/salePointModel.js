module.exports = (sequelize, DataTypes) => {
  const SalePoint = sequelize.define("salepoint", {
    shopID: {
      type: DataTypes.STRING,
      allowNull: false,
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
    businessCode: {
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
  });

  return SalePoint;
};
