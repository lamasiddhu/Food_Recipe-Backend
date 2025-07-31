const jwt = require('jsonwebtoken');
const UserModel = require('../model/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
  const { full_name, username, email, password, profile_photo } = req.body;

  try {
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    const user = await UserModel.createUser({ full_name, username, email, password, profile_photo });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await UserModel.validatePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        profile_photo: user.profile_photo,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get profile', error: error.message });
  }
};

// ✅ UPDATED: Handles image upload and public URL
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, username, email } = req.body;

    let finalProfilePhoto = null;

    if (req.file) {
      finalProfilePhoto = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (username) {
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
    }

    if (email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    const updateFields = {
      full_name,
      username,
      email,
    };

    if (finalProfilePhoto) {
      updateFields.profile_photo = finalProfilePhoto;
    }

    const updatedUser = await UserModel.updateUser(userId, updateFields);

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await UserModel.deleteUser(userId);
    if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};

exports.fetchUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Fetch user by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const userId = req.user.id;
    const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const updatedUser = await UserModel.updateUser(userId, {
      profile_photo: imagePath,
    });

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
};
