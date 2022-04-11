const sequelize = require("sequelize")
const Table = require("../models/Table")
const { v4 } = require("uuid")
const { generateCode, saveQrCodeImage } = require("../utils/helpers")

exports.createTable = async (req, res) => {
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

  // Check for exisiting table with same name
  const currentTable = await Table.findAll({
    where: {
      userId,
      name: {
        [sequelize.Op.iLike]: name.toLowerCase()
      }
    }
  })

  if (currentTable.length) {
    return res
      .status(401)
      .json({ error: true, message: "Table with this name already exists" })
  }

  const tableId = v4()
  const urlForTableCode = `${process.env.CLIENT_URL}/menu/${userId}?t=${tableId}`
  const qrcodeBase64 = await generateCode(urlForTableCode)
  const qrcodeImageUrl = await saveQrCodeImage(qrcodeBase64, tableId)

  if (!qrcodeImageUrl) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }

  try {
    await Table.create({
      id: tableId,
      name,
      qrcode: qrcodeImageUrl,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return res.status(200).json({
      success: true,
      tableId,
      url: urlForTableCode,
      message: "Table created successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.getTable = async (req, res) => {
  const userId = req.headers["userid"]
  const { id } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!id) {
    return res
      .status(401)
      .json({ error: true, message: "Table Id is required" })
  }

  try {
    const table = await Table.findOne({
      where: { userId, id }
    })

    if (!table) {
      return res
        .status(401)
        .json({ error: true, message: "Table does not exist" })
    }

    return res.status(200).json({
      success: true,
      data: table,
      message: "Table info fetched successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.getAllTables = async (req, res) => {
  const userId = req.headers["userid"]

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  try {
    const tables = await Table.findAll({
      where: {
        userId
      }
    })

    return res.status(200).json({
      success: true,
      message: "Tables fetch successfully",
      data: [...tables]
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}

exports.deleteTable = async (req, res) => {
  const userId = req.headers["userid"]
  const { id } = req.body

  if (!userId) {
    return res.status(401).json({ error: true, message: "Invalid user" })
  }

  if (!id) {
    return res
      .status(401)
      .json({ error: true, message: "Table Id is required" })
  }

  try {
    await Table.destroy({
      where: { userId, id }
    })

    return res.status(200).json({
      success: true,
      message: "Table deleted successfully"
    })
  } catch (error) {
    return res.status(401).json({ error: true, message: "An error occurred" })
  }
}
