const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const { authenticate } = require('../middleware/auth')

const uploadsDir = path.join(__dirname, '../../public/uploads')

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir)
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
      .toLowerCase().replace(/[^a-z0-9]/g, '-')
    const unique = `${name}-${Date.now()}${ext}`
    cb(null, unique)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|avif|gif|svg/
  const isAllowed = allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype)
  if (isAllowed) cb(null, true)
  else cb(new Error('Only image files are allowed'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

// POST /api/upload — single image
router.post('/', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  res.json({
    url,
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  })
})

// POST /api/upload/multiple — multiple images
router.post('/multiple', authenticate, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' })
  const files = req.files.map(f => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
    originalname: f.originalname,
    size: f.size
  }))
  res.json({ files })
})

// DELETE /api/upload/:filename
router.delete('/:filename', authenticate, (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
  fs.unlinkSync(filePath)
  res.json({ message: 'File deleted' })
})

// GET /api/upload/list — list all uploaded files
router.get('/list', authenticate, (req, res) => {
  const files = fs.readdirSync(uploadsDir).map(name => ({
    filename: name,
    url: `/uploads/${name}`,
    size: fs.statSync(path.join(uploadsDir, name)).size
  }))
  res.json(files)
})

module.exports = router
