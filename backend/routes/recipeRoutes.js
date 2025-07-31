const express = require('express');
const {
  getAllRecipes,
  generateRecipe,
  deleteRecipe, // ✅ Import delete controller
} = require('../controllers/recipeController');

const router = express.Router();

// ✅ Routes
router.get('/get-all-recipe', getAllRecipes);       // Get all recipes
router.post('/generate-recipe', generateRecipe);    // Generate recipe via AI or ingredients
router.delete('/:id', deleteRecipe);                // Delete recipe by ID

module.exports = router;
