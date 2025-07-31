jest.mock('../config/db', () => require('../__mocks__/sequelize'));
const UserModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('UserModel', () => {
  let pool;

  beforeEach(() => {
    pool = new Pool();
  });

  afterEach(() => jest.clearAllMocks());

  test('should create a new user and return user data', async () => {
    const fakeUser = {
      full_name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    pool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          full_name: fakeUser.full_name,
          username: fakeUser.username,
          email: fakeUser.email,
        },
      ],
    });

    const createdUser = await UserModel.createUser(fakeUser);

    expect(createdUser.email).toBe(fakeUser.email);
    expect(pool.query).toHaveBeenCalled();
  });

  test('should validate password correctly', async () => {
    const plain = 'mypassword';
    const hashed = await bcrypt.hash(plain, 10);
    const isValid = await UserModel.validatePassword(plain, hashed);
    expect(isValid).toBe(true);
  });
});
