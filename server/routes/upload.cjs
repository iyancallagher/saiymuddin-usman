const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const { authenticate } = require('../middleware/auth.cjs')

const uploadsDir = path.join(__dirname, '../../public/uploads')

const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, uploadsDir) },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]/g, '-')
    cb(null, `${name}-${Date.now()}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|avif|gif|svg/
  if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true)
  else cb(new Error('Only image files are allowed'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  })
})

router.post('/multiple', authenticate, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' })
  res.json({ files: req.files.map(f => ({ url: `/uploads/${f.filename}`, filename: f.filename, originalname: f.originalname, size: f.size })) })
})

router.delete('/:filename', authenticate, (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
  fs.unlinkSync(filePath)
  res.json({ message: 'File deleted' })
})

router.get('/list', authenticate, (req, res) => {
  const files = fs.readdirSync(uploadsDir).map(name => ({
    filename: name,
    url: `/uploads/${name}`,
    size: fs.statSync(path.join(uploadsDir, name)).size
  }))
  res.json(files)
})

module.exports = router
