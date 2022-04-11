const { getMenu } = require("../controllers/menu")

const menuRoutes = require("express").Router()

menuRoutes.post("/", getMenu)

module.exports = menuRoutes
