console.log('✅ userRoutes loaded');

const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/multer'); // ✅ added multer middleware

const router = express.Router();

// ✅ Test route to verify routing works
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, userController.getUserProfile);

// ✅ FIXED: Match 'profile_photo' key from frontend formData
router.put('/profile', authenticateToken, upload.single('profile_photo'), userController.updateUserProfile);

router.delete('/account', authenticateToken, userController.deleteUser);

// ✅ NEW: Fetch user by ID
router.get('/fetch-profile/:id', authenticateToken, userController.fetchUserById);

// ✅ NEW: Upload profile image only
router.post(
  '/upload-profile-image',
  authenticateToken,
  upload.single('image'), // key = "image" in Postman form-data
  userController.uploadProfileImage
);

module.exports = router;
