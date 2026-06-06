// lib/_registered.js
const fs = require('fs');
const crypto = require('crypto');

const registeredFile = './data/registered.json';

let _registered = [];
if (fs.existsSync(registeredFile)) {
    try {
        _registered = JSON.parse(fs.readFileSync(registeredFile, 'utf8'));
    } catch (err) {
        console.error("Gagal membaca registered.json:", err);
        _registered = [];
    }
} else {
    fs.writeFileSync(registeredFile, JSON.stringify([], null, 2), 'utf8');
}

function saveRegistered() {
    try {
        fs.writeFileSync(registeredFile, JSON.stringify(_registered, null, 2), 'utf8');
    } catch (err) {
        console.error("Gagal menyimpan registered.json:", err);
    }
}

function getRegisteredRandomId() {
    if (_registered.length === 0) return null;
    return _registered[Math.floor(Math.random() * _registered.length)].id;
}

function addRegisteredUser(userid, name, age, gender, time, serial) {
    const obj = { id: userid, name, age, gender, time, serial };
    _registered.push(obj);
    saveRegistered();
}

function createSerial(size) {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
}

function checkRegisteredUser(userid) {
    return _registered.some(user => user.id === userid);
}

function getRegisteredUser(userid) {
    return _registered.find(user => user.id === userid) || null;
}

function removeRegisteredUser(userid) {
    const index = _registered.findIndex(user => user.id === userid);
    if (index !== -1) {
        _registered.splice(index, 1);
        saveRegistered();
        return true;
    }
    return false;
}
module.exports.getRegisteredRandomId = getRegisteredRandomId;
module.exports.addRegisteredUser = addRegisteredUser;
module.exports.createSerial = createSerial;
module.exports.checkRegisteredUser = checkRegisteredUser;
module.exports.getRegisteredUser = getRegisteredUser;
module.exports.removeRegisteredUser = removeRegisteredUser;