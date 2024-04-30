'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserLog = sequelize.define("user_log_data", {
    user_account_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    last_login_date: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_job_applied_date: {
        type: DataTypes.STRING,
        allowNull: true,
    }
  });
  UserLog.associate = function(models) {

    UserLog.belongsTo(models.UserAccount, {
      foreignKey: 'user_account_id'
    });
    
  };
  return UserLog;
};