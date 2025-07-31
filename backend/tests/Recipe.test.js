jest.mock('../config/db', () => require('../__mocks__/sequelize'));
jest.mock('../model/RecipeModel', () => ({
  findAll: jest.fn(),
  destroy: jest.fn(),
}));

const request = require('supertest');
const app = require('../server');
const Recipe = require('../model/RecipeModel');
const sequelize = require('../config/db'); // ✅ Required to close after tests

describe('Recipe API', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /api/recipes should return all recipes', async () => {
    const fakeRecipes = [
      { id: 1, name: 'Pasta', image: 'img.jpg', ingredients: 'pasta, cheese', category: 'Italian', description: {} },
    ];
    Recipe.findAll.mockResolvedValue(fakeRecipes);

    const res = await request(app).get('/api/recipes/get-all-recipe');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeRecipes);
  });

  test('DELETE /api/recipes/:id should delete a recipe', async () => {
    Recipe.destroy.mockResolvedValue(1);

    const res = await request(app).delete('/api/recipes/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Recipe deleted successfully.');
  });

  test('DELETE /api/recipes/:id returns 404 when not found', async () => {
    Recipe.destroy.mockResolvedValue(0);

    const res = await request(app).delete('/api/recipes/999');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Recipe not found.');
  });

  // ✅ Close DB connection after all tests
  afterAll(async () => {
    await sequelize.close();
  });
});
