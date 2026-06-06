const axios = require('axios');
const qs = require('qs');

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': userAgent,
    'Referer': 'https://app.ytdown.to/en27/'
};

const findWorkerUrl = (obj, isAud) => {
    if (typeof obj === 'string') {
        if (isAud && obj.includes('/v5/audio/')) return obj;
        if (!isAud && obj.includes('/v5/video/')) return obj;
    } else if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            let res = findWorkerUrl(obj[key], isAud);
            if (res) return res;
        }
    }
    return null;
};

const findDownloadUrl = (obj) => {
    if (typeof obj === 'string') {
        if (obj.includes('iamworker.com') || obj.includes('googlevideo.com')) return obj;
    } else if (typeof obj === 'object' && obj !== null) {
        if (obj.url && obj.url.startsWith('http')) return obj.url;
        if (obj.downloadUrl && obj.downloadUrl.startsWith('http')) return obj.downloadUrl;
        if (obj.file && obj.file.startsWith('http')) return obj.file;
        for (let key in obj) {
            let res = findDownloadUrl(obj[key]);
            if (res) return res;
        }
    }
    return null;
};

async function youtubeDl(url, isAudio = false) {
    // ... (Kode blok try-catch sama persis dengan milikmu)
    try {
        let initRes = await axios.post('https://app.ytdown.to/proxy.php', qs.stringify({ url: url }), { headers, timeout: 15000 });
        let data = initRes.data;

        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) {}
        }

        let title = data.title || "YouTube Media";
        let thumbnail = data.thumbnail || data.thumb || "";

        let workerUrl = findWorkerUrl(data, isAudio);

        if (!workerUrl) {
            return { status: false, message: "Gagal Mengunduh." };
        }

        let finalDlUrl = "";
        
        for (let i = 0; i < 8; i++) {
            await new Promise(r => setTimeout(r, 3000));
            
            let pollRes = await axios.post('https://app.ytdown.to/proxy.php', qs.stringify({ url: workerUrl }), { headers, timeout: 15000 });
            let pollData = pollRes.data;
            
            if (typeof pollData === 'string') {
                try { pollData = JSON.parse(pollData); } catch (e) {}
            }

            finalDlUrl = findDownloadUrl(pollData);
            if (finalDlUrl && finalDlUrl !== workerUrl) {
                break;
            }
        }

        if (!finalDlUrl) {
            return { status: false, message: "Timeout." };
        }

        return {
            status: true,
            title,
            thumbnail,
            dl_url: finalDlUrl,
            isAudio
        };

    } catch (e) {
        let errMsg = e.code === 'ECONNABORTED' ? 'Timeout' : e.message;
        return { status: false, message: errMsg };
    }
}