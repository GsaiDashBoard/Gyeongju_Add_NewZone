const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "development": {
    "username": "gasi",
    "password": "rktl1234!",
    "database": "login",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "gasi",
    "password": "rktl1234!",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "gasi",
    "password": "rktl1234!",
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
