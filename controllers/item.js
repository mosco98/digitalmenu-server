const Item = require("../models/Item")
const sequelize = require("sequelize")

exports.addItem = async (req, res) => {
  const userId = req.headers["userid"]
  const { name, categoryId } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!categoryId) {
    return res
      .status(401)
      .json({ error: true, message: "Category Id is required" })
  }

  if (!name) {
    return res
      .status(401)
      .json({ error: true, message: "Name cannot be empty" })
  }

  // Check for exisiting category with same name
  const currentItem = await Category.findAll({
    where: {
      userId,
      categoryId,
      name: {
        [sequelize.Op.iLike]: name.toLowerCase()
      }
    }
  })

  if (currentItem.length) {
    return res
      .status(401)
      .json({ error: true, message: "Item with this name already exists" })
  }

  try {
    await Item.create({
      name,
      userId,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return res
      .status(200)
      .json({ success: true, message: "Item created successfully" })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}
