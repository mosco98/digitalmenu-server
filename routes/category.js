const categoryRoutes = require("express").Router()
const {
  createCategory,
  getAllCategories,
  getCategory,
  deleteCategory
} = require("../controllers/category")
const { isAuthenticated } = require("../middlewares/auth")

categoryRoutes.post("/create", isAuthenticated, createCategory)
categoryRoutes.get("/all", isAuthenticated, getAllCategories)
categoryRoutes.post("/one", isAuthenticated, getCategory)
categoryRoutes.post("/delete", isAuthenticated, deleteCategory)

module.exports = categoryRoutes
