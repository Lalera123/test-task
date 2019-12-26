'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    payeeId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    payerId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    paymentSystem: {
      allowNull: false,
      type: DataTypes.STRING
    },
    paymentMethod: {
      allowNull: false,
      type: DataTypes.STRING
    },
    amount: {
      allowNull: false,
      type: DataTypes.REAL
    },
    currency: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    },
    comment: {
      type: DataTypes.STRING
    }
  }, {});
  Payment.associate = function (models) {
    // associations can be defined here
  };
  return Payment;
};
