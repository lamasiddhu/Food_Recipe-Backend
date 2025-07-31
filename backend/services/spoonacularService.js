const axios = require('axios');

// Store your API key securely, ideally in a .env file
const SPOONACULAR_API_KEY = '0fe206897cfb440ea87ae3e8bc841910';

// Function to fetch recipes by ingredients
const getRecipesByIngredients = async (ingredients) => {
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients: ingredients.join(','),
        number: 5,  // Number of recipes to return
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    return response.data;  // Return the list of recipes
  } catch (error) {
    console.error('Error fetching recipes from Spoonacular:', error);
    throw new Error('Error fetching recipes');
  }
};

// Function to search recipes using complex search parameters (query)
const searchRecipes = async (query) => {
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query,  // Recipe search query (e.g., "pasta", "chicken", etc.)
        number: 5,  // Number of recipes to return
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    return response.data.results;  // Return the list of recipes based on the search query
  } catch (error) {
    console.error('Error searching recipes from Spoonacular:', error);
    throw new Error('Error searching recipes');
  }
};

// Export the functions for use in other parts of the app
module.exports = { getRecipesByIngredients, searchRecipes };
