require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const http = require("http")
const db = require("./utils/db")
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const tableRoutes = require("./routes/table")
const categoryRoutes = require("./routes/category")
const itemRoutes = require("./routes/item")
const menuRoutes = require("./routes/menu")

const { Server } = require("socket.io")
const Order = require("./models/Order")
const httpServer = http.createServer(app)

const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" } })

// Test db connection
db.authenticate()
  .then(() =>
    console.log("Database Connection has been established successfully!")
  )
  .catch((error) => console.error("Unable to connect to the database:", error))

// Middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(bodyParser.json())

// API Routes
app.use("/user", userRoutes)
app.use("/auth", authRoutes)
app.use("/table", tableRoutes)
app.use("/category", categoryRoutes)
app.use("/item", itemRoutes)
app.use("/menu", menuRoutes)

// console.log(require("crypto").randomBytes(64).toString("hex"))

io.on("connection", (socket) => {
  socket.on("sendOrder", async (payload) => {
    const { userId, tableId, order } = payload
    console.log(userId, tableId, order)

    if (!userId || !tableId || !order) {
      return
    }

    try {
      const newOrder = await Order.create({
        userId,
        tableId,
        order_details: JSON.stringify(order),
        createdAt: new Date(),
        updatedAt: new Date()
      })

      socket.emit("orderStatus", { success: true })
      socket.emit("newOrder", newOrder)
    } catch (error) {
      return socket.emit("orderStatus", { error: true })
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

httpServer.listen(4000)

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`Server is now running on port ${port}`))
