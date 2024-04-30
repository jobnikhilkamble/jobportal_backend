'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserType = sequelize.define("user_type", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  });

  return UserType;
};