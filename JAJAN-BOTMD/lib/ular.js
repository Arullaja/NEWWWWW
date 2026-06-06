const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const db = require('./users.js'); // Mengambil database limit kamu

const BOARD_MAPS = [
    {
        map: "https://telegra.ph/file/46a0c38104f79cdbfe83f.jpg",
        name: "Classic",
        snakesLadders: {
            2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 78: 98, 71: 91, 87: 94,
            16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80
        },
        stabil_x: 20,
        stabil_y: 20
    }
];

const PLAYER_IMAGES = [
    "https://telegra.ph/file/30f92f923fb0484f0e4e0.png",
    "https://telegra.ph/file/6e07b5f30b24baedc7822.png",
    "https://telegra.ph/file/34f47137df0dc9aa9c15a.png",
    "https://telegra.ph/file/860b5df98963a1f14a91c.png"
];

const DICE_STICKERS = [
    "https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/1.webp",
    "https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/2.webp",
    "https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/3.webp",
    "https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/4.webp",
    "https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/5.webp",
    "https://raw.githubusercontent.com/fgmods/fg-team/main/games/dados/6.webp"
];

const PLAYER_COLORS = ["🔴", "🟡", "🟢", "🔵"];
const PLAYER_NAMES = ["Merah", "Kuning", "Hijau", "Biru"];
const WIN_REWARD = { limit: 10 }; // Hadiah limit jika menang

async function drawBoard(boardImageURL, user1 = null, user2 = null, user3 = null, user4 = null, stabil_x = 20, stabil_y = 20) {
    try {
        const board = await Jimp.read(boardImageURL);
        const playerPositions = [user1, user2, user3, user4].map((pos, idx) => ({
            position: pos,
            index: idx
        })).filter(p => p.position !== null && p.position >= 1 && p.position <= 100);

        for (const player of playerPositions) {
            const position = player.position;
            const row = Math.floor((position - 1) / 10);
            const col = (row % 2 === 0) ? (position - 1) % 10 : 9 - (position - 1) % 10;
            const x = col * 60 + stabil_x;
            const y = (9 - row) * 60 + stabil_y;

            try {
                const playerImage = await Jimp.read(PLAYER_IMAGES[player.index]);
                playerImage.resize(50, 50);
                board.composite(playerImage, x - 4, y - 4, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                });
            } catch (e) {
                console.log(`[ULARTANGGA] Failed to load player ${player.index} image:`, e.message);
            }
        }
        return await board.getBufferAsync(Jimp.MIME_PNG);
    } catch (error) {
        console.error('[ULARTANGGA] Error drawing board:', error.message);
        return null;
    }
}

function getRandomMap() {
    return BOARD_MAPS[Math.floor(Math.random() * BOARD_MAPS.length)];
}

// Handler untuk Command Switch
async function utCommand(sock, m, args, prefix, isOwner) {
    if (!global.ulartanggaGames) global.ulartanggaGames = {};
    const ut = global.ulartanggaGames;
    const action = args[0] ? args[0].toLowerCase() : '';

    const reply = (text) => sock.sendMessage(m.chat, { text }, { quoted: m });

    if (action === 'create') {
        if (ut[m.chat]) return reply(`❌ *ROOM SUDAH ADA*\n\n> Masih ada sesi permainan di chat ini!\n> Host: @${ut[m.chat].host.split("@")[0]}\n> Status: ${ut[m.chat].status}`);
        
        const mapConfig = getRandomMap();
        ut[m.chat] = {
            status: "WAITING",
            host: m.sender,
            players: {},
            turn: 0,
            map: mapConfig.map,
            mapName: mapConfig.name,
            snakesLadders: mapConfig.snakesLadders,
            stabil_x: mapConfig.stabil_x,
            stabil_y: mapConfig.stabil_y,
        };
        ut[m.chat].players[m.sender] = { rank: "HOST", position: 1 };

        await sock.sendMessage(m.chat, { react: { text: "🎲", key: m.key } });
        return sock.sendMessage(m.chat, {
            text: `🐍🎲 *ULAR TANGGA*\n\nRoom berhasil dibuat!\n\n╭┈┈⬡「 📋 *INFO ROOM* 」\n┃ 👑 Host: @${m.sender.split("@")[0]}\n┃ 👥 Players: 1/4\n┃ 🗺️ Map: ${mapConfig.name}\n╰┈┈┈┈┈┈┈┈⬡\n\n╭┈┈⬡「 🎮 *COMMANDS* 」\n┃ ➕ \`${prefix}ut join\` - Gabung\n┃ ▶️ \`${prefix}ut start\` - Mulai\n┃ ℹ️ \`${prefix}ut info\` - Info room\n┃ 🚪 \`${prefix}ut exit\` - Keluar\n╰┈┈┈┈┈┈┈┈⬡`,
            mentions: [m.sender]
        }, { quoted: m });
    }

    if (action === 'join') {
        if (!ut[m.chat]) return reply(`❌ Tidak ada sesi permainan!\n> Ketik \`${prefix}ut create\` untuk membuat room.`);
        if (ut[m.chat].players[m.sender]) return reply(`❌ Kamu sudah bergabung di room ini!`);
        
        const players = Object.keys(ut[m.chat].players);
        if (players.length >= 4) return reply(`❌ Room sudah penuh! (Max 4 player)`);
        if (ut[m.chat].status === "PLAYING") return reply(`❌ Game sedang berjalan, tidak bisa join!`);

        ut[m.chat].players[m.sender] = { rank: "MEMBER", position: 1 };
        players.push(m.sender);

        const playerList = players.map((p, i) => `┃ ${PLAYER_COLORS[i]} ${PLAYER_NAMES[i]}: @${p.split("@")[0]}`).join("\n");

        await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        return sock.sendMessage(m.chat, {
            text: `✅ *PLAYER BERGABUNG*\n\n@${m.sender.split("@")[0]} masuk!\n\n╭┈┈⬡「 👥 *PLAYERS* 」\n${playerList}\n╰┈┈┈┈┈┈┈┈⬡\n\n> Total: ${players.length}/4\n> ${players.length >= 2 ? `✅ Bisa mulai! \`${prefix}ut start\`` : "🕕 Butuh 1 player lagi"}`,
            mentions: players
        }, { quoted: m });
    }

    if (action === 'start') {
        if (!ut[m.chat]) return reply(`❌ Tidak ada sesi permainan!`);
        if (ut[m.chat].status === "PLAYING") return reply(`❌ Permainan sudah berjalan!`);
        if (ut[m.chat].host !== m.sender && !isOwner) return reply(`❌ Hanya host yang dapat memulai permainan!`);
        
        const players = Object.keys(ut[m.chat].players);
        if (players.length < 2) return reply(`❌ Minimal 2 player untuk bermain!`);

        ut[m.chat].status = "PLAYING";
        ut[m.chat].turn = 0;

        const playerList = players.map((p, i) => `┃ ${PLAYER_COLORS[i]} ${PLAYER_NAMES[i]}: @${p.split("@")[0]}`).join("\n");
        const positions = players.map(p => ut[m.chat].players[p].position);
        
        await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const boardImage = await drawBoard(ut[m.chat].map, positions[0], positions[1], positions[2], positions[3], ut[m.chat].stabil_x, ut[m.chat].stabil_y);

        let msgOptions = {
            caption: `🐍🎲 *PERMAINAN DIMULAI!*\n\n╭┈┈⬡「 👥 *PLAYERS* 」\n${playerList}\n╰┈┈┈┈┈┈┈┈⬡\n\n> 🎯 Giliran: @${players[0].split("@")[0]}\n> Ketik *kocok* untuk lempar dadu!`,
            mentions: players
        };
        if (boardImage) msgOptions.image = boardImage;
        else msgOptions.text = msgOptions.caption; // Fallback jika gagal generate map

        return sock.sendMessage(m.chat, msgOptions, { quoted: m });
    }

    if (action === 'info') {
        if (!ut[m.chat]) return reply(`❌ Tidak ada sesi permainan!`);
        const players = Object.keys(ut[m.chat].players);
        const playerList = players.map((p, i) => `┃ ${PLAYER_COLORS[i]} ${PLAYER_NAMES[i]}: @${p.split("@")[0]} - Pos: ${ut[m.chat].players[p].position}`).join("\n");
        const currentTurn = ut[m.chat].status === "PLAYING" ? players[ut[m.chat].turn % players.length] : null;

        return sock.sendMessage(m.chat, {
            text: `🐍🎲 *INFO ROOM*\n\n╭┈┈⬡「 📋 *ROOM* 」\n┃ 👑 Host: @${ut[m.chat].host.split("@")[0]}\n┃ 📍 Status: ${ut[m.chat].status}\n┃ 🗺️ Map: ${ut[m.chat].mapName}\n┃ 👥 Players: ${players.length}/4\n╰┈┈┈┈┈┈┈┈⬡\n\n╭┈┈⬡「 👥 *PLAYERS* 」\n${playerList}\n╰┈┈┈┈┈┈┈┈⬡` + (currentTurn ? `\n\n> 🎯 Giliran: @${currentTurn.split("@")[0]}` : ""),
            mentions: players
        }, { quoted: m });
    }

    if (action === 'exit') {
        if (!ut[m.chat]) return reply(`❌ Tidak ada sesi permainan!`);
        if (!ut[m.chat].players[m.sender]) return reply(`❌ Kamu tidak ada di permainan ini!`);

        delete ut[m.chat].players[m.sender];
        reply(`👋 @${m.sender.split("@")[0]} keluar dari permainan.`);

        const players = Object.keys(ut[m.chat].players);
        if (players.length === 0) {
            delete ut[m.chat];
            return reply(`🗑️ Room dihapus karena tidak ada player.`);
        }

        if (ut[m.chat].host === m.sender) {
            const newHost = players[0];
            ut[m.chat].host = newHost;
            ut[m.chat].players[newHost].rank = "HOST";
            sock.sendMessage(m.chat, { text: `👑 Host dipindahkan ke @${newHost.split("@")[0]}`, mentions: [newHost] });
        }

        if (ut[m.chat].status === "PLAYING") {
            ut[m.chat].turn = ut[m.chat].turn % players.length;
            sock.sendMessage(m.chat, { text: `> Giliran: @${players[ut[m.chat].turn].split("@")[0]}\n> Ketik *kocok*`, mentions: [players[ut[m.chat].turn]] });
        }
        return;
    }

    if (action === 'delete') {
        if (!ut[m.chat]) return reply(`❌ Tidak ada sesi permainan!`);
        if (ut[m.chat].host !== m.sender && !isOwner) return reply(`❌ Hanya host yang dapat menghapus room!`);
        delete ut[m.chat];
        return reply(`🗑️ Room berhasil dihapus!`);
    }

    // Default Menu
    return sock.sendMessage(m.chat, {
        text: `🐍🎲 *ULAR TANGGA*\n\nPermainan klasik yang penuh petualangan!\nNaiki tangga, hindari ular, sampai ke 100!\n\n╭┈┈⬡「 🎮 *COMMANDS* 」\n┃ 🎲 \`${prefix}ut create\` - Buat room\n┃ ➕ \`${prefix}ut join\` - Gabung room\n┃ ▶️ \`${prefix}ut start\` - Mulai game\n┃ ℹ️ \`${prefix}ut info\` - Info room\n┃ 🚪 \`${prefix}ut exit\` - Keluar\n┃ 🗑️ \`${prefix}ut delete\` - Hapus room\n╰┈┈┈┈┈┈┈┈⬡\n\n╭┈┈⬡「 🏆 *HADIAH* 」\n┃ 💰 +${WIN_REWARD.limit} Limit\n╰┈┈┈┈┈┈┈┈⬡\n\n> Min 2 player, Max 4 player`
    }, { quoted: m });
}

// Handler untuk Detektor "Kocok"
async function utKocok(sock, m, body) {
    const text = body.trim().toLowerCase();
    if (text !== "kocok") return false;

    if (!global.ulartanggaGames) return false;
    const ut = global.ulartanggaGames;
    if (!ut[m.chat] || ut[m.chat].status !== "PLAYING") return false;

    const players = Object.keys(ut[m.chat].players);
    if (!players.includes(m.sender)) return false;

    const currentTurn = ut[m.chat].turn % players.length;
    if (players.indexOf(m.sender) !== currentTurn) {
        sock.sendMessage(m.chat, { text: `❌ Bukan giliranmu!\n> Giliran: @${players[currentTurn].split("@")[0]}`, mentions: [players[currentTurn]] }, { quoted: m });
        return true;
    }

    const dadu = Math.floor(Math.random() * 6) + 1;
    const DICE_EMOJI = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    try {
        await sock.sendMessage(m.chat, { sticker: { url: DICE_STICKERS[dadu - 1] } }, { quoted: m });
    } catch (e) {
        await sock.sendMessage(m.chat, { react: { text: DICE_EMOJI[dadu - 1], key: m.key } });
    }

    const oldPos = ut[m.chat].players[m.sender].position;
    let newPos = oldPos + dadu;

    if (newPos > 100) newPos = 100 - (newPos - 100);

    let event = "";
    const snakesLadders = ut[m.chat].snakesLadders;
    if (snakesLadders[newPos]) {
        const destination = snakesLadders[newPos];
        event = destination > newPos ? `\n🪜 *Naik tangga!*` : `\n🐍 *Kena ular!*`;
        newPos = destination;
    }

    ut[m.chat].players[m.sender].position = newPos;
    const playerIdx = players.indexOf(m.sender);
    const color = PLAYER_COLORS[playerIdx];
    const name = PLAYER_NAMES[playerIdx];

    // Cek Kemenangan
    if (newPos === 100) {
        try {
            if (db && typeof db.addLimit === 'function') db.addLimit(m.sender, WIN_REWARD.limit);
        } catch (e) { console.log("Gagal memberi reward:", e); }

        const positions = players.map(p => ut[m.chat].players[p]?.position || null);
        const boardImage = await drawBoard(ut[m.chat].map, positions[0], positions[1], positions[2], positions[3], ut[m.chat].stabil_x, ut[m.chat].stabil_y);

        let msgWin = `🎉 *PEMENANG!*\n\n${color} @${m.sender.split("@")[0]} sampai ke 100!\n\n╭┈┈⬡「 🎁 *HADIAH* 」\n┃ 💰 +${WIN_REWARD.limit} Limit\n╰┈┈┈┈┈┈┈┈⬡\n\n> GG WP! Main lagi? \`.ut create\``;
        
        if (boardImage) await sock.sendMessage(m.chat, { image: boardImage, caption: msgWin, mentions: [m.sender] });
        else await sock.sendMessage(m.chat, { text: msgWin, mentions: [m.sender] });

        delete ut[m.chat];
        return true;
    }

    ut[m.chat].turn++;
    const nextTurn = ut[m.chat].turn % players.length;
    const nextPlayer = players[nextTurn];

    const positions = players.map(p => ut[m.chat].players[p]?.position || null);
    const boardImage = await drawBoard(ut[m.chat].map, positions[0], positions[1], positions[2], positions[3], ut[m.chat].stabil_x, ut[m.chat].stabil_y);

    let msgState = `🎲 *DADU: ${dadu}* ${DICE_EMOJI[dadu - 1]}\n\n${color} ${name}: *${oldPos}* → *${newPos}*${event}\n\n> 🎯 Giliran: @${nextPlayer.split("@")[0]}\n> Ketik *kocok*`;

    if (boardImage) await sock.sendMessage(m.chat, { image: boardImage, caption: msgState, mentions: [nextPlayer] });
    else await sock.sendMessage(m.chat, { text: msgState, mentions: [nextPlayer] });

    return true;
}