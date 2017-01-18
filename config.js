module.exports = {
  DB: {
    test: 'mongodb://localhost/animal-app-test',
    production: 'mongodb://admin:admin@ds113938.mlab.com:13938/animal-app-db'
  },
  PORT: {
    test: 3010,
    production: 3000
  }
};
