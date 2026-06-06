// =============================================
// LIB/TOURL.JS - ES MODULE VERSION
// =============================================

const axios = require('axios');
const FormData = require('form-data');

/**
 * Mendapatkan Mime Type secara manual
 */
function getMimeType(ext) {
    const mimes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.webp': 'image/webp'
    };
    return mimes[ext.toLowerCase()] || 'application/octet-stream';
}

/**
 * Upload ke Catbox.moe
 */
async function uploadCatbox(buffer, ext) {
    try {
        const mime = getMimeType(ext);
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", buffer, {
            filename: `file${ext}`,
            contentType: mime
        });

        const res = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: { ...form.getHeaders() },
            timeout: 120000
        });

        const url = res.data.trim();
        return url.startsWith('http') ? url : null;
    } catch (e) {
        console.error("Catbox Error:", e.message);
        return null;
    }
}

/**
 * Upload ke Qu.ax
 */
async function uploadQuax(buffer, ext) {
    try {
        const mime = getMimeType(ext);
        const form = new FormData();
        form.append("files[]", buffer, { 
            filename: `file${ext}`,
            contentType: mime
        });

        const res = await axios.post("https://qu.ax/upload.php", form, { 
            headers: form.getHeaders(),
            timeout: 60000 
        });
        return res.data?.success ? res.data.files[0].url : null;
    } catch (e) {
        return null;
    }
}

/**
 * Upload ke Termai.cc
 */
async function uploadTermai(buffer, ext) {
    try {
        const termaiKey = "AIzaBj7z2z3xBjsk";
        const form = new FormData();
        form.append('file', buffer, { filename: `file${ext}` });

        const res = await axios.post(`https://c.termai.cc/api/upload?key=${termaiKey}`, form, { 
            headers: form.getHeaders(),
            timeout: 60000 
        });
        return res.data?.status ? res.data.path : null;
    } catch (e) {
        return null;
    }
}

/**
 * Upload ke Pixhost.to 
 */
async function uploadPixhost(buffer) {
    try {
        
        const { ImageUploadService } = await import('node-upload-images');
        const service = new ImageUploadService('pixhost.to');
        const { directLink } = await service.uploadFromBinary(buffer, 'Vanness.png');
        return directLink;
    } catch (e) {
        console.error("Pixhost Error:", e.message);
        return null;
    }
}

/**
 * Fungsi Utama - Multi Host
 */
async function tourl(buffer, ext = '.jpg') {
    const [catbox, quax, termai, pixhost] = await Promise.all([
        uploadCatbox(buffer, ext),
        uploadQuax(buffer, ext),
        uploadTermai(buffer, ext),
        uploadPixhost(buffer)
    ]);

    return { catbox, quax, termai, pixhost };
}

module.exports.tourl = tourl;