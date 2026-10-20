const express = require('express')
const router = express.Router()
const { readData, writeData } = require('../utils/data.cjs')
const { authenticate } = require('../middleware/auth.cjs')

const FILE = 'services.json'

router.get('/', (req, res) => res.json(readData(FILE)))

router.put('/', authenticate, (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Payload must be an array' })
  writeData(FILE, req.body)
  res.json(req.body)
})

router.put('/:index', authenticate, (req, res) => {
  const services = readData(FILE)
  const idx = Number(req.params.index)
  if (isNaN(idx) || idx < 0 || idx >= services.length) return res.status(404).json({ error: 'Not found' })
  services[idx] = { ...services[idx], ...req.body }
  writeData(FILE, services)
  res.json(services[idx])
})

module.exports = router
