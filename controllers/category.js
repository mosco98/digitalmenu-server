const Category = require("../models/Category")
const sequelize = require("sequelize")

exports.createCategory = async (req, res) => {
  const userId = req.headers["userid"]
  const { name } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!name) {
    return res
      .status(401)
      .json({ error: true, message: "Name cannot be empty" })
  }

  // Check for exisiting category with same name
  const currentCategory = await Category.findAll({
    where: {
      userId,
      name: {
        [sequelize.Op.iLike]: name.toLowerCase()
      }
    }
  })

  if (currentCategory.length) {
    return res
      .status(401)
      .json({ error: true, message: "Category with this name already exists" })
  }

  try {
    await Category.create({
      name,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return res
      .status(200)
      .json({ success: true, message: "Category created successfully" })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.getAllCategories = async (req, res) => {
  const userId = req.headers["userid"]

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  try {
    const categories = await Category.findAll({
      where: {
        userId
      }
    })

    return res.status(200).json({
      success: true,
      message: "Categories fetch successful",
      data: [...categories]
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}
