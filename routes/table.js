const tableRoutes = require("express").Router()
const {
  createTable,
  getAllTables,
  getTable,
  deleteTable
} = require("../controllers/table")
const { isAuthenticated } = require("../middlewares/auth")

tableRoutes.post("/create", isAuthenticated, createTable)
tableRoutes.get("/all", isAuthenticated, getAllTables)
tableRoutes.post("/one", isAuthenticated, getTable)
tableRoutes.post("/delete", isAuthenticated, deleteTable)

module.exports = tableRoutes
