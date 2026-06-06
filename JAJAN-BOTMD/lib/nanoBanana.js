// lib/nanoBanana.js
const axios = require('axios');
const FormData = require('form-data');

/**
 * Upload buffer gambar ke tmpfiles.org dan dapatkan direct download link
 * @param {Buffer} buffer - Buffer gambar (misal dari message.imageMessage)
 * @param {string} filename - Nama file (default: random.jpg)
 * @returns {Promise<string>} URL download langsung
 */
async function uploadToTempFiles(buffer, filename = `nano_${Date.now()}.jpg`) {
  const form = new FormData();
  form.append("file", buffer, {
    filename,
    contentType: "image/jpeg", // bisa diganti sesuai mime type asli
  });

  try {
    const res = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
      headers: form.getHeaders(),
      timeout: 60000, // 60 detik
    });

    if (res.data?.status === "success" && res.data?.data?.url) {
      // Ganti ke direct download link (penting!)
      return res.data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
    }
    throw new Error(`Upload gagal: ${JSON.stringify(res.data)}`);
  } catch (err) {
    console.error("[uploadToTempFiles error]", err.message);
    throw new Error(`Gagal upload ke tmpfiles: ${err.message}`);
  }
}

/**
 * Generate/edit gambar menggunakan endpoint nano-banana (via api-faa.my.id)
 * @param {Buffer} imageBuffer - Buffer gambar input (untuk edit)
 * @param {string} prompt - Prompt deskripsi edit/generasi
 * @returns {Promise<Buffer>} Buffer gambar hasil
 */
async function nanoBanana(imageBuffer, prompt) {
  if (!Buffer.isBuffer(imageBuffer)) {
    throw new Error("Parameter pertama harus Buffer gambar");
  }
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt wajib diisi (string)");
  }

  try {
    // 1. Upload gambar ke tmpfiles.org
    const imageUrl = await uploadToTempFiles(imageBuffer);

    // 2. Panggil API nano-banana
    const apiUrl = `https://api-faa.my.id/faa/nano-banana?url=${encodeURIComponent(
      imageUrl
    )}&prompt=${encodeURIComponent(prompt)}`;

    const imgRes = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 120000, // 2 menit (proses AI bisa lama)
    });

    // Pastikan response adalah gambar (cek header atau magic bytes jika perlu)
    if (imgRes.headers["content-type"]?.includes("image")) {
      return Buffer.from(imgRes.data);
    }

    throw new Error("Response bukan gambar (bukan image/*)");
  } catch (err) {
    console.error("[nanoBanana error]", {
      message: err.message,
      code: err.code,
      response: err.response?.data?.toString?.() || "no data",
    });

    if (err.response?.status === 429) {
      throw new Error("Rate limit API tercapai. Coba lagi nanti.");
    }
    if (err.response?.status === 400 || err.response?.status === 422) {
      throw new Error("Prompt atau gambar tidak valid. Coba prompt lebih jelas.");
    }

    throw new Error(`Gagal generate nano-banana: ${err.message}`);
  }
}