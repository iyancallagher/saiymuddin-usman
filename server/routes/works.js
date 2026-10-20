const express = require('express')
const { v4: uuidv4 } = require('uuid')
const router = express.Router()
const { readData, writeData } = require('../utils/data')
const { authenticate } = require('../middleware/auth')

const FILE = 'works.json'

// GET /api/works — public
router.get('/', (req, res) => {
  const works = readData(FILE)
  const { category, origin, featured } = req.query
  let result = works

  if (category) result = result.filter(w => w.category === category)
  if (origin) result = result.filter(w => w.origin === origin)
  if (featured === 'true') result = result.filter(w => w.featured)

  res.json(result)
})

// GET /api/works/:id — public
router.get('/:id', (req, res) => {
  const works = readData(FILE)
  const work = works.find(w => w.id === req.params.id)
  if (!work) return res.status(404).json({ error: 'Work not found' })
  res.json(work)
})

// POST /api/works — protected
router.post('/', authenticate, (req, res) => {
  const works = readData(FILE)
  const newWork = {
    id: req.body.id || req.body.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || uuidv4(),
    title: req.body.title || '',
    category: req.body.category || 'photography',
    origin: req.body.origin || 'personal',
    year: Number(req.body.year) || new Date().getFullYear(),
    client: req.body.client || '',
    role: req.body.role || '',
    cover: req.body.cover || '',
    media: req.body.media || [],
    description: req.body.description || '',
    tags: req.body.tags || [],
    featured: Boolean(req.body.featured),
    createdAt: new Date().toISOString()
  }

  // Ensure unique id
  const existing = works.find(w => w.id === newWork.id)
  if (existing) newWork.id = `${newWork.id}-${Date.now()}`

  works.unshift(newWork)
  writeData(FILE, works)
  res.status(201).json(newWork)
})

// PUT /api/works/:id — protected
router.put('/:id', authenticate, (req, res) => {
  const works = readData(FILE)
  const idx = works.findIndex(w => w.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Work not found' })

  const updated = {
    ...works[idx],
    ...req.body,
    id: req.params.id, // keep original id
    updatedAt: new Date().toISOString()
  }
  works[idx] = updated
  writeData(FILE, works)
  res.json(updated)
})

// DELETE /api/works/:id — protected
router.delete('/:id', authenticate, (req, res) => {
  const works = readData(FILE)
  const idx = works.findIndex(w => w.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Work not found' })

  const [deleted] = works.splice(idx, 1)
  writeData(FILE, works)
  res.json({ message: 'Deleted', deleted })
})

// PATCH /api/works/:id/featured — toggle featured
router.patch('/:id/featured', authenticate, (req, res) => {
  const works = readData(FILE)
  const idx = works.findIndex(w => w.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Work not found' })

  works[idx].featured = !works[idx].featured
  writeData(FILE, works)
  res.json({ id: req.params.id, featured: works[idx].featured })
})

module.exports = router
