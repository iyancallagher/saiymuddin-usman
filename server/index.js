require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const authRouter = require('./routes/auth')
const worksRouter = require('./routes/works')
const servicesRouter = require('./routes/services')
const agenciesRouter = require('./routes/agencies')
const testimonialsRouter = require('./routes/testimonials')
const uploadRouter = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 3001

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static uploads
app.use('/uploads', express.static(uploadsDir))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/works', worksRouter)
app.use('/api/services', servicesRouter)
app.use('/api/agencies', agenciesRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/upload', uploadRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 CMS Server running at http://localhost:${PORT}`)
  console.log(`📁 Data directory: ${path.join(__dirname, '../src/data')}`)
  console.log(`🔐 Login: ${process.env.ADMIN_USERNAME} / ${process.env.ADMIN_PASSWORD}\n`)
})
