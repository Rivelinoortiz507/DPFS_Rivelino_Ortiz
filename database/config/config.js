module.exports = {
  development: {
    username: 'root', 
    password: '2751356junior', 
    database: 'booksdb',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  
  test: {
    username: 'root',
    password: null,
    database: 'booksdb_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'booksdb_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
