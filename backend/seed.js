// seed.js
const sequelize = require('./config/db');
const Recipe = require('./model/RecipeModel');


const seedRecipes = async () => {
  try {
    await sequelize.sync({ force: true }); // ⚠️ Drops existing tables
    console.log("Database synced.");

    const recipes = [
      {
        name: "Spaghetti Bolognese",
        image: "https://via.placeholder.com/300",
        ingredients: "spaghetti, minced beef, tomato sauce, onions, garlic",
        category: "Italian",
        description: ["Boil pasta", "Cook beef", "Add sauce", "Mix and serve"]
      },
      {
        name: "Chicken Curry",
        image: "https://via.placeholder.com/300",
        ingredients: "chicken, curry paste, coconut milk, onions",
        category: "Indian",
        description: ["Sauté onions", "Add chicken", "Add curry paste", "Simmer with coconut milk"]
      }
    ];

    await Recipe.bulkCreate(recipes);
    console.log("✅ Recipes seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedRecipes();
