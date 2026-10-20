const path = require('path')
const fs = require('fs')

const DATA_DIR = path.join(__dirname, '../../src/data')

/**
 * Read a JSON data file
 */
function readData(filename) {
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

/**
 * Write data to a JSON file (pretty-printed)
 */
function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

module.exports = { readData, writeData }
