const express = require('express')
const router = express.Router()
const { readData, writeData } = require('../utils/data')
const { authenticate } = require('../middleware/auth')

const FILE = 'agencies.json'

router.get('/', (req, res) => res.json(readData(FILE)))

router.put('/:index', authenticate, (req, res) => {
  const agencies = readData(FILE)
  const idx = Number(req.params.index)
  if (isNaN(idx) || idx < 0 || idx >= agencies.length) return res.status(404).json({ error: 'Not found' })
  agencies[idx] = { ...agencies[idx], ...req.body }
  writeData(FILE, agencies)
  res.json(agencies[idx])
})

module.exports = router
