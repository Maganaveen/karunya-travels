const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { register, login, getProfile, updateProfile, changePassword, uploadAvatar } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Avatar upload setup
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'avatar-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const avatarUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error('Only image files are allowed'), ext && mime);
  }
});

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.post('/upload-avatar', auth, avatarUpload.single('avatar'), uploadAvatar);

module.exports = router;
