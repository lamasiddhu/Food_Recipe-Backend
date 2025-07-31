const Recipe = require("../model/RecipeModel");
const {
  getRecipesByIngredients,
  searchRecipes,
} = require("../services/spoonacularService");

// ✅ Fetch all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// ✅ Generate recipe based on ingredients or query
const generateRecipe = async (req, res) => {
  const { ingredients, query } = req.body;

  if (!ingredients && !query) {
    return res
      .status(400)
      .json({ message: "Please provide either ingredients or a query." });
  }

  try {
    let recipes = [];

    if (ingredients && ingredients.length > 0) {
      recipes = await getRecipesByIngredients(ingredients);
    }

    if (query) {
      recipes = await searchRecipes(query);
    }

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found." });
    }

    res.status(200).json({
      message: "Recipes fetched successfully!",
      recipes,
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res
      .status(500)
      .json({ message: "Error fetching recipes, please try again later." });
  }
};

// ✅ Delete recipe by ID
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Recipe.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe." });
  }
};

// ✅ Export all controllers
module.exports = {
  getAllRecipes,
  generateRecipe,
  deleteRecipe,
};
