const express = require('express')
const router = express.Router()
const { readData, writeData } = require('../utils/data.cjs')
const { authenticate } = require('../middleware/auth.cjs')

const FILE = 'testimonials.json'

router.get('/', (req, res) => res.json(readData(FILE)))

router.post('/', authenticate, (req, res) => {
  const list = readData(FILE)
  const item = {
    id: Date.now(),
    name: req.body.name || '',
    role: req.body.role || '',
    company: req.body.company || '',
    avatar: req.body.avatar || '',
    quote: req.body.quote || '',
    rating: Number(req.body.rating) || 5
  }
  list.push(item)
  writeData(FILE, list)
  res.status(201).json(item)
})

router.put('/:id', authenticate, (req, res) => {
  const list = readData(FILE)
  const idx = list.findIndex(t => String(t.id) === String(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  list[idx] = { ...list[idx], ...req.body, id: list[idx].id }
  writeData(FILE, list)
  res.json(list[idx])
})

router.delete('/:id', authenticate, (req, res) => {
  const list = readData(FILE)
  const idx = list.findIndex(t => String(t.id) === String(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [deleted] = list.splice(idx, 1)
  writeData(FILE, list)
  res.json({ message: 'Deleted', deleted })
})

module.exports = router
