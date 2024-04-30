'use strict';
var bcrypt = require('bcrypt-nodejs');
var bbPromise = require('bluebird');

module.exports = (sequelize, DataTypes) => {
  const UserAccount = sequelize.define("user_account", {
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_notification_otp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    mobile_notification_otp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mobile_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    sms_notification_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    email_notification_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registration_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
  }, {
    hooks: {
      beforeUpdate: function(user) {
        return new bbPromise(function(resolve, reject) {
          bcrypt.genSalt(5, function(err, salt) {
            if (err) { reject(err); return; }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
              if (err) { reject(err); return; }
              user.password = hash;
              resolve(user);
            });
          });
        });
      },
      beforeCreate: function(user) {
        return new bbPromise(function(resolve, reject) {
          bcrypt.genSalt(5, function(err, salt) {
            if (err) { reject(err); return; }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
              if (err) { reject(err); return; }
              user.password = hash;
              resolve(user);
            });
          });
        });
      }
    },
    defaultScope: {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    },
    scopes: {
      withPassword: {
        attributes: { },
      }
    }
  });

  UserAccount.prototype.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  UserAccount.associate = function(models) {

    UserAccount.belongsTo(models.UserType, {
      foreignKey: 'user_type_id'
    });
    
  };

  return UserAccount;
};