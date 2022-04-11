const Category = require("../models/Category")
const sequelize = require("sequelize")
const Item = require("../models/Item")

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
    const newCategory = await Category.create({
      name,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (newCategory) {
      return res.status(200).json({
        success: true,
        categoryId: newCategory.id,
        message: "Category created successfully"
      })
    }
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.getCategory = async (req, res) => {
  const userId = req.headers["userid"]
  const { id } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!id) {
    return res
      .status(401)
      .json({ error: true, message: "Category Id is required" })
  }

  try {
    const category = await Category.findOne({
      where: { userId, id }
    })

    if (!category) {
      return res
        .status(401)
        .json({ error: true, message: "Category does not exist" })
    }

    return res.status(200).json({
      success: true,
      data: category,
      message: "Category info fetched successfully"
    })
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

exports.deleteCategory = async (req, res) => {
  const userId = req.headers["userid"]
  const { id } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!id) {
    return res
      .status(401)
      .json({ error: true, message: "Category Id is required" })
  }

  try {
    await Category.destroy({
      where: { userId, id }
    })

    await Item.destroy({
      where: { userId, categoryId: id }
    })

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}
