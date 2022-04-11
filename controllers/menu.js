const Category = require("../models/Category")
const Item = require("../models/Item")
const Table = require("../models/Table")

exports.getMenu = async (req, res) => {
  const { userId, tableId } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "User does not exist" })
  }

  if (!tableId) {
    return res.status(401).json({ error: true, message: "Invalid table Id" })
  }

  const table = await Table.findOne({ where: { id: tableId } })

  if (!table) {
    return res
      .status(401)
      .json({ error: true, message: "Table does not exist" })
  }

  try {
    const categories = await Category.findAll({ where: { userId } })

    const categoriesWithItems = await Promise.all(
      categories.map(async (category) => {
        category.dataValues.items = await Item.findAll({
          where: { categoryId: category.id }
        })

        return category
      })
    )

    res.status(200).json({
      success: true,
      data: [...categoriesWithItems],
      tableInfo: table,
      message: "Menu fetched successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}
