const { DataTypes } = require("sequelize")
const db = require("../utils/db")

const Order = db.define("order", {
  id: {
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tableId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order_details: {
    type: DataTypes.STRING,
    allowNull: false
  },
  settled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
})

module.exports = Order
