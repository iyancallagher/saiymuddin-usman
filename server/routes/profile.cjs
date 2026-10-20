const express = require('express')
const router = express.Router()
const { readData, writeData } = require('../utils/data.cjs')
const { authenticate } = require('../middleware/auth.cjs')

const FILE = 'profile.json'

// GET /api/profile — public
router.get('/', (req, res) => {
  res.json(readData(FILE))
})

// GET /api/profile/hero — public
router.get('/hero', (req, res) => {
  const profile = readData(FILE)
  res.json(profile.hero || {})
})

// GET /api/profile/about — public
router.get('/about', (req, res) => {
  const profile = readData(FILE)
  res.json(profile.about || {})
})

// PUT /api/profile/hero — protected
router.put('/hero', authenticate, (req, res) => {
  const profile = readData(FILE)
  profile.hero = { ...profile.hero, ...req.body }
  writeData(FILE, profile)
  res.json(profile.hero)
})

// PUT /api/profile/about — protected
router.put('/about', authenticate, (req, res) => {
  const profile = readData(FILE)
  profile.about = { ...profile.about, ...req.body }
  writeData(FILE, profile)
  res.json(profile.about)
})

// PUT /api/profile — update both at once
router.put('/', authenticate, (req, res) => {
  const current = readData(FILE)
  const updated = {
    hero: req.body.hero ? { ...current.hero, ...req.body.hero } : current.hero,
    about: req.body.about ? { ...current.about, ...req.body.about } : current.about
  }
  writeData(FILE, updated)
  res.json(updated)
})

module.exports = router
