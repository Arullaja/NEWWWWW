const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const uploader = {}

uploader.ryuudev = async (filePath) => {
  try {
    const form = new FormData()
    form.append("image", fs.createReadStream(filePath))
    form.append("title", "Upload via WhatsApp Bot")

    const res = await axios.post(
      "https://ryuu-dev.offc.my.id/tools/upload-image",
      form,
      { headers: { ...form.getHeaders() } }
    )

    const data = res.data

    if (!data.success || !data.result?.success) {
      throw new Error("Upload gagal (ryuudev)")
    }

    return data.result.data.link
  } catch (err) {
    throw new Error("Ryuudev error: " + err.message)
  }
}

uploader.catbox = async (filePath) => {
  try {
    const form = new FormData()
    form.append("reqtype", "fileupload")
    form.append("fileToUpload", fs.createReadStream(filePath))

    const res = await axios.post(
      "https://catbox.moe/user/api.php",
      form,
      { headers: { ...form.getHeaders() } }
    )

    if (!res.data.startsWith("https://")) {
      throw new Error("Upload gagal (catbox)")
    }

    return res.data.trim()
  } catch (err) {
    throw new Error("Catbox error: " + err.message)
  }
}

uploader.uguu = async (filePath) => {
  try {
    const form = new FormData()
    form.append("files[]", fs.createReadStream(filePath))

    const res = await axios.post(
      "https://uguu.se/upload.php",
      form,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
          ...form.getHeaders()
        }
      }
    )

    if (!res.data?.files?.[0]?.url) {
      throw new Error("Upload gagal (uguu)")
    }

    return res.data.files[0].url
  } catch (err) {
    throw new Error("Uguu error: " + err.message)
  }
}

module.exports = uploader