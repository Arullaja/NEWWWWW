const { createCanvas, loadImage } = require('canvas');

const setting = {
    auto_welcomeMsg: true,
    auto_leaveMsg: true,
    pathimg: 'https://c.termai.cc/i168/tp4.jpeg',
    // Tambahan: background khusus untuk leave (selamat tinggal)
    leaveBg: 'https://c.termai.cc/i131/4tEDA.jpeg', // <-- ini thumbnail berbeda untuk leave
    footer: '© @VannessWangsaff ID V2'
};

function formatWaktuIndonesia() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return now.toLocaleString('id-ID', options) + ' WIB';
}

async function welcome(sock, anu) {
    try {
        // Ambil metadata grup (dengan fallback jika desc kosong)
        let metadata;
        try {
            metadata = await sock.groupMetadata(anu.id);
        } catch (e) {
            metadata = { subject: 'Grup Tanpa Nama', desc: 'Tidak ada deskripsi' };
        }

        const groupName = metadata.subject || 'Grup Tanpa Nama';
        let groupDesc = metadata.desc || 'Tidak ada deskripsi grup';

        // Jika desc masih kosong, coba ambil dari cache atau beri pesan default
        if (!groupDesc || groupDesc === 'null' || groupDesc.trim() === '') {
            groupDesc = 'Tidak ada deskripsi grup (atau belum di-load)';
        }

        const waktuSekarang = formatWaktuIndonesia();

        for (let num of anu.participants) {
            // Ambil pushName user (nama yang ditampilkan di WA)
            let pushName = 'Member';
            try {
                const contact = await sock.getContact(num);
                pushName = contact?.pushName || contact?.notify || num.split('@')[0];
            } catch {}

            let pp_user;
            try {
                pp_user = await sock.profilePictureUrl(num, 'image');
            } catch {
                pp_user = setting.pathimg;
            }

            async function createWelcomeCard(isWelcome = true) {
                // Gunakan pathimg untuk welcome, leaveBg untuk leave
                const backgroundURL = isWelcome ? setting.pathimg : setting.leaveBg;
                const avatarURL = pp_user;
                const title = isWelcome ? 'Selamat Datang' : 'Selamat Tinggal';

                const width = 700;
                const height = 420;
                const canvas = createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                const bg = await loadImage(backgroundURL);
                ctx.drawImage(bg, 0, 0, width, height);

                ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
                ctx.fillRect(10, 10, width - 20, height - 20);

                ctx.strokeStyle = '#00BFFF';
                ctx.lineWidth = 8;
                ctx.strokeRect(10, 10, width - 20, height - 20);

                const avatar = await loadImage(avatarURL);
                const avatarSize = 140;
                const avatarX = width / 2 - avatarSize / 2;
                const avatarY = 60;

                ctx.save();
                ctx.beginPath();
                ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
                ctx.restore();

                ctx.beginPath();
                ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.strokeStyle = '#00BFFF';
                ctx.lineWidth = 5;
                ctx.stroke();

                ctx.font = 'bold 42px Arial';
                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.fillText(title, width / 2, avatarY + avatarSize + 60);

                ctx.font = '28px Arial';
                ctx.fillStyle = '#E0FFFF';
                ctx.fillText(groupName, width / 2, avatarY + avatarSize + 100);

                ctx.font = '20px Arial';
                ctx.fillStyle = '#FFFFFF';
                const descLines = groupDesc.split('\n').slice(0, 3);
                descLines.forEach((line, i) => {
                    ctx.fillText(line.substring(0, 60) + (line.length > 60 ? '...' : ''),
                                 width / 2, avatarY + avatarSize + 140 + i * 28);
                });

                ctx.font = '18px Arial';
                ctx.fillStyle = '#B0E0E6';
                ctx.fillText(waktuSekarang, width / 2, height - 30);

                return canvas.toBuffer();
            }

            // WELCOME
            if (anu.action === 'add' && setting.auto_welcomeMsg) {
                const cardBuffer = await createWelcomeCard(true);

                let pesan = global.db?.data?.chats?.[anu.id]?.textwelcome || 
                    `Halo *${pushName}* (@user) 👋\n` +
                    `Selamat datang di *${groupName}*!\n\n` +
                    `Deskripsi Grup:\n@desc\n\n` +
                    `Jangan lupa baca aturan dan sapa member lain ya~`;

                pesan = pesan
                    .replace(/@user/gi, `@${num.split('@')[0]}`)
                    .replace(/@group/gi, groupName)
                    .replace(/@desc/gi, groupDesc)
                    .replace(/@pushname/gi, pushName);

                await sock.sendMessage(anu.id, {
                    image: cardBuffer,
                    caption: pesan + `\n\n${waktuSekarang}`,
                    mentions: [num],
                    footer: setting.footer,
                    buttons: [
                        {
                            buttonId: `.intro`,
                            buttonText: { displayText: "📝 KARTU INTRO" },
                            type: 1
                        }
                    ],
                    viewOnce: true
                });
            }

            // LEAVE
            else if (anu.action === 'remove' && setting.auto_leaveMsg) {
                const cardBuffer = await createWelcomeCard(false); // false = leave → pakai leaveBg

                let pesan = global.db?.data?.chats?.[anu.id]?.textleave || 
                    `Selamat tinggal *${pushName}* (@user) 👋\n` +
                    `Kami akan merindukanmu... (atau mungkin tidak 😏)\n\n` +
                    `Deskripsi Grup:\n@desc`;

                pesan = pesan
                    .replace(/@user/gi, `@${num.split('@')[0]}`)
                    .replace(/@group/gi, groupName)
                    .replace(/@desc/gi, groupDesc)
                    .replace(/@pushname/gi, pushName);

                await sock.sendMessage(anu.id, {
                    image: cardBuffer,
                    caption: pesan + `\n\n${waktuSekarang}`,
                    mentions: [num],
                    footer: setting.footer
                });
            }
        }
    } catch (err) {
        console.error('[WELCOME/LEAVE ERROR]', err.message || err);
    }
}

// Fungsi untuk generate gambar kartu intro
async function generateIntroCard(sock, jid, groupName = 'Grup Kita', userData = {}) {
    try {
        const pushName = userData.nama || 'Member Baru';
        const usia     = userData.usia   || '-';
        const lokasi   = userData.lokasi || '-';
        const funfact  = userData.funfact|| '-';
        const motto    = userData.motto  || '-';

        // Potong teks agar tidak overflow
        const maxLength = 28;
        const short = (str) => str.length > maxLength ? str.substring(0, maxLength-3) + '...' : str;

        let pp_user;
        try {
            pp_user = await sock.profilePictureUrl(jid, 'image');
        } catch {
            pp_user = 'https://files.catbox.moe/cp29pc.jpg';
        }

        const width = 700;
        const height = 520;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        const bg = await loadImage('https://files.catbox.moe/cp29pc.jpg');
        ctx.drawImage(bg, 0, 0, width, height);

        // Overlay gelap
        ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
        ctx.fillRect(20, 20, width - 40, height - 40);

        // Border
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        // Avatar
        const avatar = await loadImage(pp_user);
        const avatarSize = 120;  // dikecilkan sedikit
        const avatarX = width / 2 - avatarSize / 2;
        const avatarY = 45;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Judul (lebih kecil)
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('Kartu Intro', width / 2, avatarY + avatarSize + 60);

        // Data intro - font lebih kecil & rapi
        ctx.font = 'bold 20px Arial';   // ← ukuran ini yang paling pas di 700px
        ctx.fillStyle = '#E0FFFF';
        ctx.textAlign = 'left';

        const startY = avatarY + avatarSize + 110;
        const lineHeight = 35;          // jarak antar baris lebih rapat
        const leftMargin = 70;

        ctx.fillText(`Nama     : ${short(pushName)}`, leftMargin, startY);
        ctx.fillText(`Usia     : ${short(usia)}`,     leftMargin, startY + lineHeight);
        ctx.fillText(`Lokasi   : ${short(lokasi)}`,   leftMargin, startY + lineHeight * 2);
        ctx.fillText(`Fun Fact : ${short(funfact)}`,  leftMargin, startY + lineHeight * 3);
        ctx.fillText(`Motto    : ${short(motto)}`,    leftMargin, startY + lineHeight * 4);

        // Footer
        ctx.font = 'italic 20px Arial';
        ctx.fillStyle = '#B0E0E6';
        ctx.textAlign = 'center';
        ctx.fillText(`Selamat bergabung di ${short(groupName)}! 🍃✨`, width / 2, height - 70);

        ctx.font = '16px Arial';
        ctx.fillText(formatWaktuIndonesia(), width / 2, height - 35);

        return canvas.toBuffer();
    } catch (err) {
        console.error('[INTRO CARD ERROR]', err);
        return null;
    }
}

module.exports.welcome = welcome;
module.exports.generateIntroCard = generateIntroCard;