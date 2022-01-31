const qrcode = require("qrcode")
const { ref, uploadString, getDownloadURL } = require("firebase/storage")
const firebaseStorage = require("./firebase")

exports.generateCode = (url) => {
  return qrcode.toDataURL(url)
}

exports.saveQrCodeImage = async (base64, tableId) => {
  const storageRef = ref(firebaseStorage, tableId)

  const response = await uploadString(storageRef, base64, "data_url")

  let url

  if (response.metadata.name) {
    const responseUrl = await getDownloadURL(storageRef)

    url = responseUrl
  }

  return url
}
