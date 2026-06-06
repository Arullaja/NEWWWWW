// CJS wrapper for file-type
// file-type v16.x is the last CJS-compatible version
const fileType = require('file-type');

async function fileTypeFromBuffer(buffer) {
  // v16 API
  if (fileType.fromBuffer) {
    return await fileType.fromBuffer(buffer);
  }
  // fallback
  return await fileType(buffer);
}

module.exports = { fileTypeFromBuffer };
