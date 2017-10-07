const fs = require('fs');
const path = require('path');

module.exports = {
  baseUrl: process.env.BASE_API_URL || '',
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, process.env.PEM_FILE_PATH)),
    cert: fs.readFileSync(path.join(__dirname, process.env.CRT_FILE_PATH)),
    key: fs.readFileSync(path.join(__dirname, process.env.KEY_FILE_PATH)),
    passphrase: process.env.CRT_PASSPHRASE,
  }
}
