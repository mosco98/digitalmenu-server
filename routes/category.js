const categoryRoutes = require("express").Router()
const { createCategory, getAllCategories } = require("../controllers/category")
const { isAuthenticated } = require("../middlewares/auth")

categoryRoutes.post("/create", isAuthenticated, createCategory)
categoryRoutes.get("/all", isAuthenticated, getAllCategories)

module.exports = categoryRoutes
