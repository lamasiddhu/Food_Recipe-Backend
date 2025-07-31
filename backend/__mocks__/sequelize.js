const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// 👇 Define mock DataTypes
const DataTypes = {
  INTEGER: 'INTEGER',
  STRING: 'STRING',
  TEXT: 'TEXT',
  JSON: 'JSON',
};

// 👇 Use dbMock.define directly without recursion
function define(modelName, schema) {
  const mockModel = dbMock.define(modelName, schema);
  mockModel.findAll = jest.fn();
  mockModel.destroy = jest.fn();
  return mockModel;
}

// 👇 Export a working mock Sequelize object
module.exports = {
  define,
  sync: jest.fn(() => Promise.resolve()),
  authenticate: jest.fn(() => Promise.resolve()),
  close: jest.fn(),
  DataTypes,
};
