const { addItem } = require("../controllers/item")
const { isAuthenticated } = require("../middlewares/auth")

const itemRoutes = require("express").Router()

itemRoutes.post("/add", isAuthenticated, addItem)

module.exports = itemRoutes
