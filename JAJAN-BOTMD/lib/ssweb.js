// lib/ssweb.js
const axios = require('axios');

async function ssweb3(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    const apiUrl = `https://api-faa.my.id/faa/ssweb-3hasil?url=${encodeURIComponent(url)}`;
    
    const { data } = await axios.get(apiUrl, { timeout: 60000 });

    if (!data?.status || !data?.results) {
        throw new Error("Gagal mengambil screenshot dari API");
    }

    const results = data.results;
    const mediaList = [];

    for (const [device, imgUrl] of Object.entries(results)) {
        if (!imgUrl) continue;

        try {
            const imgRes = await axios.get(imgUrl, {
                responseType: "arraybuffer",
                timeout: 30000
            });

            const deviceEmoji = {
                desktop: "🖥️",
                mobile: "📱",
                tablet: "📲"
            }[device] || "📷";

            mediaList.push({
                image: Buffer.from(imgRes.data),
                caption: `${deviceEmoji} *${device.toUpperCase()}*\n\n` +
                         `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
                         `┃ 🔗 URL: \`${url}\`\n` +
                         `┃ 📱 Device: *${device}*\n` +
                         `╰┈┈⬡`
            });
        } catch (e) {
            console.log(`[SSWeb] Gagal download ${device}:`, e.message);
        }
    }

    if (mediaList.length === 0) throw new Error("Gagal mengunduh screenshot");

    return mediaList;
}