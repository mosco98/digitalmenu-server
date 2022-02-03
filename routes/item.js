const {
  addItem,
  getAllItems,
  getItem,
  deleteItem
} = require("../controllers/item")
const { isAuthenticated } = require("../middlewares/auth")

const itemRoutes = require("express").Router()

itemRoutes.post("/add", isAuthenticated, addItem)
itemRoutes.post("/all", isAuthenticated, getAllItems)
itemRoutes.post("/one", isAuthenticated, getItem)
itemRoutes.post("/delete", isAuthenticated, deleteItem)

module.exports = itemRoutes
