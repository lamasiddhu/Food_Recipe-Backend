console.log('✅ server.js started');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const sequelize = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const newRecipeRoutes = require('./routes/newRecipeRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from "uploads" folder
app.use('/uploads', express.static('uploads'));

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/new-recipes', newRecipeRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Only start server when not in test mode OR being run directly
sequelize.sync()
  .then(() => {
    if (process.env.NODE_ENV !== 'test' || require.main === module) {
      console.log('✅ Database connected and synced');
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    }
  })
  .catch(err => console.error('❌ Database sync error:', err));

// Export app for testing
module.exports = app;
