const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi' })
  }

  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ error: 'Username atau password salah' })
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.json({
    token,
    user: { username, role: 'admin' },
    expiresIn: '24h'
  })
})

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false })
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ valid: true, user: decoded })
  } catch {
    res.status(401).json({ valid: false })
  }
})

module.exports = router
