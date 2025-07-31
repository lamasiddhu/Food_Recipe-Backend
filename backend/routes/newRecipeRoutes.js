const express = require('express');
const RecipeController = require('../controllers/newRecipeController');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/add-recipe', upload.single('image'), RecipeController.createRecipe); // Handle image upload
router.get('/get-all-recipe', RecipeController.getAllRecipes);
router.get('/get-recipe-by-id/:id', RecipeController.getRecipeById); // Fixed path
router.put('/update-recipe/:id', upload.single('image'), RecipeController.updateRecipe);
router.delete('/delete/:id', RecipeController.deleteRecipe); // Fixed path

module.exports = router;
