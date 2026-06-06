const fs = require('fs');

const jajanPath = 'c:\\Users\\pepet\\JAJAN-BOTMD\\jajan.js';
let content = fs.readFileSync(jajanPath, 'utf8');

// The function we want to encrypt:
const functionStr = `async function(qrData, name, price, totalPayment) {
    const canvas = createCanvas(600, 700);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 700);
    grad.addColorStop(0, '#5a189a');
    grad.addColorStop(1, '#3c096c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 700);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 450; y < 700; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
    }
    for (let x = -200; x <= 800; x += 50) {
        ctx.beginPath();
        ctx.moveTo(300, 350);
        ctx.lineTo(x, 700);
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(-50, 200, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(650, 350, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('QRIS', 40, 50);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('QR Code Standar', 40, 65);
    ctx.fillText('Pembayaran Nasional', 40, 77);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic bold 20px sans-serif';
    ctx.fillText('GPN', 510, 50);
    ctx.font = '9px sans-serif';
    ctx.fillText('GERBANG PEMBAYARAN NASIONAL', 430, 65);

    ctx.fillStyle = '#ffffff';
    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
    }
    roundRect(110, 110, 380, 380, 12);

    ctx.fillStyle = '#d90429';
    ctx.beginPath();
    ctx.moveTo(110, 122);
    ctx.arcTo(110, 110, 122, 110, 12);
    ctx.lineTo(478, 110);
    ctx.arcTo(490, 110, 490, 122, 12);
    ctx.lineTo(490, 160);
    ctx.lineTo(110, 160);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN HERE TO PAY', 300, 142);

    try {
        const qrUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=\${encodeURIComponent(qrData)}\`;
        const qrCodeImg = await loadImage(qrUrl);
        ctx.drawImage(qrCodeImg, 150, 180, 300, 300);
    } catch (err) {
        console.error("Gagal load QR code image:", err);
        ctx.fillStyle = '#000000';
        ctx.fillRect(150, 180, 300, 300);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.fillText('Gagal memuat QR Code', 300, 330);
    }

    const fee = totalPayment - price;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('DESKRIPSI', 110, 520);
    ctx.fillText('JUMLAH', 410, 520);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(110, 530);
    ctx.lineTo(490, 530);
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name.length > 22 ? name.substring(0, 22) + '...' : name, 110, 560);
    ctx.textAlign = 'right';
    ctx.fillText(\`Rp \${price.toLocaleString('id-ID')}\`, 490, 560);

    ctx.textAlign = 'left';
    ctx.fillText('Biaya Admin (QRIS)', 110, 590);
    ctx.textAlign = 'right';
    ctx.fillText(\`Rp \${fee.toLocaleString('id-ID')}\`, 490, 590);

    ctx.beginPath();
    ctx.moveTo(110, 610);
    ctx.lineTo(490, 610);
    ctx.stroke();

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffb703';
    ctx.textAlign = 'left';
    ctx.fillText('Total Pembayaran', 110, 645);
    ctx.textAlign = 'right';
    ctx.fillText(\`Rp \${totalPayment.toLocaleString('id-ID')}\`, 490, 645);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.fillText('Powered by VannessStore & JAJAN-BOT V.1', 300, 680);

    return canvas.toBuffer();
}`;

const encodedString = functionStr
    .split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) + 19968))
    .join('');

const targetToReplace = `async function generateQrisCanvas(qrData, name, price, totalPayment) {
    const canvas = createCanvas(600, 700);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 700);
    grad.addColorStop(0, '#5a189a');
    grad.addColorStop(1, '#3c096c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 700);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 450; y < 700; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
    }
    for (let x = -200; x <= 800; x += 50) {
        ctx.beginPath();
        ctx.moveTo(300, 350);
        ctx.lineTo(x, 700);
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(-50, 200, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(650, 350, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('QRIS', 40, 50);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('QR Code Standar', 40, 65);
    ctx.fillText('Pembayaran Nasional', 40, 77);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic bold 20px sans-serif';
    ctx.fillText('GPN', 510, 50);
    ctx.font = '9px sans-serif';
    ctx.fillText('GERBANG PEMBAYARAN NASIONAL', 430, 65);

    ctx.fillStyle = '#ffffff';
    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
    }
    roundRect(110, 110, 380, 380, 12);

    ctx.fillStyle = '#d90429';
    ctx.beginPath();
    ctx.moveTo(110, 122);
    ctx.arcTo(110, 110, 122, 110, 12);
    ctx.lineTo(478, 110);
    ctx.arcTo(490, 110, 490, 122, 12);
    ctx.lineTo(490, 160);
    ctx.lineTo(110, 160);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN HERE TO PAY', 300, 142);

    try {
        const qrUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=\${encodeURIComponent(qrData)}\`;
        const qrCodeImg = await loadImage(qrUrl);
        ctx.drawImage(qrCodeImg, 150, 180, 300, 300);
    } catch (err) {
        console.error("Gagal load QR code image:", err);
        ctx.fillStyle = '#000000';
        ctx.fillRect(150, 180, 300, 300);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.fillText('Gagal memuat QR Code', 300, 330);
    }

    const fee = totalPayment - price;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('DESKRIPSI', 110, 520);
    ctx.fillText('JUMLAH', 410, 520);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(110, 530);
    ctx.lineTo(490, 530);
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name.length > 22 ? name.substring(0, 22) + '...' : name, 110, 560);
    ctx.textAlign = 'right';
    ctx.fillText(\`Rp \${price.toLocaleString('id-ID')}\`, 490, 560);

    ctx.textAlign = 'left';
    ctx.fillText('Biaya Admin (QRIS)', 110, 590);
    ctx.textAlign = 'right';
    ctx.fillText(\`Rp \${fee.toLocaleString('id-ID')}\`, 490, 590);

    ctx.beginPath();
    ctx.moveTo(110, 610);
    ctx.lineTo(490, 610);
    ctx.stroke();

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffb703';
    ctx.textAlign = 'left';
    ctx.fillText('Total Pembayaran', 110, 645);
    ctx.textAlign = 'right';
    ctx.fillText(\`Rp \${totalPayment.toLocaleString('id-ID')}\`, 490, 645);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.fillText('Powered by VannessStore & JAJAN-BOT V.1', 300, 680);

    return canvas.toBuffer();
}`;

const replacementStr = `const VannessCanvas = "${encodedString}";
async function generateQrisCanvas(qrData, name, price, totalPayment) {
    const _0xCanvas = (str) => str.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 19968)).join('');
    return eval("(" + _0xCanvas(VannessCanvas) + ")")(qrData, name, price, totalPayment);
}`;

if (content.includes(targetToReplace)) {
    content = content.replace(targetToReplace, replacementStr);
    fs.writeFileSync(jajanPath, content, 'utf8');
    console.log("Canvas function successfully encrypted in jajan.js!");
} else {
    console.log("Error: Target canvas function not found exactly in jajan.js");
}
