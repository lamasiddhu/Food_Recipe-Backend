const Recipe = require('../model/RecipeModel');
const fs = require('fs');
const path = require('path');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const { name, ingredients, category, description } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    if (!name || !ingredients || !category || !description || !image) {
      return res.status(400).json({ message: "All fields, including image, are required" });
    }

    const recipe = await Recipe.create({
      image,
      name,
      ingredients,
      category,
      description: JSON.stringify(description), // Store as JSON string
    });

    res.status(201).json({
      ...recipe.toJSON(),
      description: JSON.parse(recipe.description), // Return as array
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(
      recipes.map((recipe) => ({
        ...recipe.toJSON(),
        description: isJsonString(recipe.description) ? JSON.parse(recipe.description) : recipe.description,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.status(200).json({
      ...recipe.toJSON(),
      description: isJsonString(recipe.description) ? JSON.parse(recipe.description) : recipe.description,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    let { name, ingredients, category, description } = req.body;
    let image = recipe.image; // Keep the existing image by default

    // If a new image is uploaded
    if (req.file) {
      // Delete the old image from the server
      if (recipe.image) {
        const oldImagePath = path.join(__dirname, '../uploads', path.basename(recipe.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Convert description to JSON string if provided
    if (description) {
      description = JSON.stringify(description);
    }

    // Update only the provided fields
    await recipe.update({
      image,
      name: name || recipe.name,
      ingredients: ingredients || recipe.ingredients,
      category: category || recipe.category,
      description: description || recipe.description,
    });

    res.status(200).json({
      ...recipe.toJSON(),
      description: isJsonString(recipe.description) ? JSON.parse(recipe.description) : recipe.description,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Delete the image file
    if (recipe.image) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(recipe.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await recipe.destroy();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to check if a string is valid JSON
const isJsonString = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};
