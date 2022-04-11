const Item = require("../models/Item")
const sequelize = require("sequelize")

exports.addItem = async (req, res) => {
  const userId = req.headers["userid"]
  const { name, categoryId, price } = req.body

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
  const currentItem = await Item.findAll({
    where: {
      userId,
      categoryId,
      name: {
        [sequelize.Op.iLike]: name.toLowerCase()
      }
    }
  })

  if (currentItem.length > 0) {
    return res
      .status(401)
      .json({ error: true, message: "Item with this name already exists" })
  }

  try {
    await Item.create({
      name,
      userId,
      categoryId,
      price: Number(price),
      available: true,
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

exports.getItem = async (req, res) => {
  const userId = req.headers["userid"]
  const { id, categoryId } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!id) {
    return res.status(401).json({ error: true, message: "Item Id is required" })
  }

  if (!categoryId) {
    return res
      .status(401)
      .json({ error: true, message: "Category Id is required" })
  }

  try {
    const item = await Item.findOne({
      where: { userId, id, categoryId }
    })

    if (!item) {
      return res
        .status(401)
        .json({ error: true, message: "Item does not exist" })
    }

    return res.status(200).json({
      success: true,
      data: item,
      message: "Item info fetched successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.getAllItems = async (req, res) => {
  const userId = req.headers["userid"]
  const { categoryId } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!categoryId) {
    return res
      .status(401)
      .json({ error: true, message: "Category Id is required" })
  }

  try {
    const items = await Item.findAll({
      where: {
        userId,
        categoryId
      },
      limit: 10,
      order: [["createdAt", "DESC"]]
    })

    return res.status(200).json({
      success: true,
      message: "Items fetch successfully",
      data: [...items]
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.editItem = async (req, res) => {
  const userId = req.headers["userid"]
  const { id, categoryId, name, price, available } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!id) {
    return res.status(401).json({ error: true, message: "Item Id is required" })
  }

  if (!categoryId) {
    return res
      .status(401)
      .json({ error: true, message: "Category Id is required" })
  }

  const item = await Item.findOne({
    where: { userId, id, categoryId }
  })

  if (!item) {
    return res.status(401).json({ error: true, message: "Item not found" })
  }

  try {
    await Item.update(
      { name, price: Number(price), available, updatedAt: new Date() },
      {
        where: { userId, id, categoryId }
      }
    )

    return res.status(200).json({
      success: true,
      message: "Item saved successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.deleteItem = async (req, res) => {
  const userId = req.headers["userid"]
  const { id, categoryId } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!id) {
    return res.status(401).json({ error: true, message: "Item Id is required" })
  }

  if (!categoryId) {
    return res
      .status(401)
      .json({ error: true, message: "Category Id is required" })
  }

  try {
    await Item.destroy({
      where: { userId, id, categoryId }
    })

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}
