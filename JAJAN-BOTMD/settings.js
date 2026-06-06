/**
 * JAJAN-BOT V.1 - Configuration
 * Authorized by @VannessWangsaff
 * Jangan Delete Creditnya ya cokk
 */

const fs = require('fs');
const chalk = require('chalk');

global.pairingKode = "JAJANBOT"; // custom pair code nya
global.owner = ["6288287677384"];

global.versi = "1.0.0";
global.url = "https://tokowelperid.web.id";
global.namaOwner = "Vanness Wangsaff";
global.namaBot = "JAJAN-BOT V.1";
global.packname = "Create by @VannessWangsaff";
global.author = "JAJAN-BOT V.1";

global.idCh = "120363335443641236@newsletter";
global.linkSaluran = "https://whatsapp.com/channel/0029Vak1Mh81noz57tVkqv2y";
global.namaSaluran = "JAJAN BOT INFORMATION";

// [ PENTING ] Konfigurasi lewat pakasir lu https://pakasir.my.id
global.PROJECT_SLUG = "jajan-bot";
global.API_KEY_PAKASIR = "tLYq2SJDu55Wgr5lRZtrXg2dtbOdDHLB";

global.anticall = {
  active: true,
  warningMessage: `⚠️ *SYSTEM ERROR - CALL BLOCK*\n\n` +
    `Panggilan suara & video tidak didukung oleh bot.\n` +
    `Nomor Anda diblokir otomatis oleh sistem keamanan.\n` +
    `Silakan hubungi owner untuk membuka blokir.`,
  excludedNumbers: [
    "0@s.whatsapp.net"
  ],
  notifyOwner: true,
  ownerJid: "0@s.whatsapp.net"
};

global.regSession = global.regSession || new Map();
global.autoBackup = false;
global.backupInterval = null;
global.sock = null;

global.thumb = "https://raw.githubusercontent.com/VANNESS56/DatabaseJajan/main/jajan.jpg";
global.foto = "https://raw.githubusercontent.com/VANNESS56/DatabaseJajan/main/jajan.jpg";
global.menuSetting = "gif";
global.mp4Menu = "./media/menu.gif";
global.audioMenu = "./media/menu.mp3";

// CPanel V1
global.loc = "1";
global.egg = "15";
global.nestid = "5";
global.domain = "https://vannessstore.id";
global.apikey = "ptla_blablablabla";
global.capikey = "ptlc_blablablabla";

// CPanel V2
global.locV2 = "1";
global.eggV2 = "15";
global.nestidV2 = "5";
global.domainV2 = "https://vannessstore.id";
global.apikeyV2 = "ptla_hohohohoh";
global.capikeyV2 = "ptlc_hahahahaha";

global.teksPanel = `┌━━━〔 *DETAIL GARANSI & DURASI* 〕━━━⚙️
┃ ⏳ *Masa Aktif* : 30 Hari (Satu Bulan Penuh)
┃ 📦 *Garansi*    : 20 Hari (Maksimal 5x Replace)
┃ 💡 *Catatan*    : Simpan data panel ini secara rahasia!
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌━━━〔 *KEBIJAKAN & SYARAT LAYANAN* 〕━━━⚠️
┃ 🚫 Dilarang keras spam, hacking, DDOS server.
┃ 🚫 Penyalahgunaan resource berlebih = Suspend permanen.
┃ 🚫 Klaim garansi wajib sertakan bukti transfer & order.
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> _Layanan panel server berkualitas tinggi oleh VannessStore._`;

global.mess = {
  owner: "🔒 *[AKSES DITOLAK]* Perintah ini khusus untuk Owner / Creator bot.",
  admin: "🛡️ *[REJECT]* Fitur ini hanya dapat digunakan oleh Admin Group.",
  botAdmin: "⚙️ *[REJECT]* Sistem membutuhkan hak akses Admin untuk menjalankan perintah ini.",
  group: "👥 *[REJECT]* Perintah ini hanya dapat dijalankan di dalam Chat Group.",
  sewa: "💎 *[REJECT]* Fitur eksklusif ini hanya untuk pelanggan Sewa / Premium.",
  vip: "👑 *[REJECT]* Hak akses ditolak. Hanya untuk Owner & pengguna VIP/Premium.",
  private: "💬 *[REJECT]* Perintah ini hanya dapat dikirimkan melalui Chat Pribadi.",
  prem: "🌟 *[AKSES DITOLAK]* Fitur ini dikunci. Silakan upgrade ke Premium."
};

fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename);
  console.log(chalk.white.bold("\n~> [SYSTEM] Configurations Updated:"), chalk.green.bold(__filename));
  delete require.cache[require.resolve(__filename)];
  require(__filename);
});

global.settingMenu = "gif";
