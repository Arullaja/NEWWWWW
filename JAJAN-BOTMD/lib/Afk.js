const afkStorage = global.afkStorage || (global.afkStorage = new Map());

function getAfkUser(jid) {
    return afkStorage.get(jid) || null;
}

function setAfkUser(jid, reason) {
    afkStorage.set(jid, {
        reason: reason || 'Tidak ada alasan user',
        time: Date.now()
    });
}

function removeAfkUser(jid) {
    afkStorage.delete(jid);
}

function isUserAfk(jid) {
    return afkStorage.has(jid);
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours} jam ${minutes % 60} menit`;
    } else if (minutes > 0) {
        return `${minutes} menit ${seconds % 60} detik`;
    } else {
        return `${seconds} detik`;
    }
}

async function checkAfk(m, sock) {
    // 1. Deteksi jika user yang sedang AFK
    const afkData = getAfkUser(m.sender);
    if (afkData) {
        removeAfkUser(m.sender);
        const duration = formatDuration(Date.now() - afkData.time);
        await sock.sendMessage(m.chat, {
            text: `👋 *ᴀꜰᴋ ᴜsᴇʀ ᴛᴇʟᴀʜ ʙᴇʀᴀᴋʜɪʀ*\n\n\`\`\`@${m.sender.split('@')[0]} sudah kembali!\`\`\`\n⌯⌲ \`Durasi AFK:\` *${duration}*`,
            mentions: [m.sender]
        }, { quoted: m });
    }

    // 2. Deteksi jika ada yang men-tag user yang sedang AFK
    const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (m.isGroup && mentionedJid.length > 0) {
        for (const mentioned of mentionedJid) {
            const mentionedAfk = getAfkUser(mentioned);
            if (mentionedAfk) {
                const duration = formatDuration(Date.now() - mentionedAfk.time);
                await sock.sendMessage(m.chat, {
                    text: `💤 *ᴜsᴇʀ sᴇᴅᴀɴɢ ᴀꜰᴋ*\n\n\`\`\`Hufft hama, jangan di ganggu!\`\`\` \`@${mentioned.split('@')[0]}\` lagi AFK\n⌯⌲ \`Alasan:\` *${mentionedAfk.reason}*\n⌯⌲ \`Sejak:\` *${duration} yang lalu*`,
                    mentions: [mentioned]
                }, { quoted: m });
            }
        }
    }
}
module.exports = { getAfkUser, setAfkUser, removeAfkUser, isUserAfk, formatDuration, checkAfk };
