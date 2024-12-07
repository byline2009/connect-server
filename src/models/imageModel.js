module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("imageSalePoint", {
    imageName: {
      type: DataTypes.STRING,
    },
  });

  return Image;
};
