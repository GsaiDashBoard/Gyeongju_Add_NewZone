const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  development: {
    databases: {
      Database1: {
        username: "gasi",
        password: "rktl1234!",
        database: "login",
        host: "172.30.1.140",
        dialect: "mysql",
      },
      Database2: {
        username: "gasi",
        password: "rktl1234!",
        database: "scanner",
        host: "172.30.1.140",
        dialect: "mysql",
      },
      Database3: {
        username: "gasi",
        password: "rktl1234!",
        database: "AR_DB",
        host: "172.30.1.140",
        dialect: "mysql",
      },
    },
  },
  // test: {
  //   databases: {
  //     Database1: {
  //       username: "gasi",
  //       password: "rktl1234!",
  //       database: "login",
  //       host: "172.30.1.140",
  //       dialect: "mysql",
  //     },
  //     Database2: {
  //       username: "gasi",
  //       password: "rktl1234!",
  //       database: "scanner",
  //       host: "172.30.1.140",
  //       dialect: "mysql",
  //     },
  //     Database3: {
  //       username: "gasi",
  //       password: "rktl1234!",
  //       database: "AR_DB",
  //       host: "172.30.2.88",
  //       dialect: "mysql",
  //     },
  //   },
  // },
  // production: {
  //   Database1: {
  //     username: "gasi",
  //     password: "rktl1234!",
  //     database: "login",
  //     host: "172.30.1.140",
  //     dialect: "mysql",
  //   },
  //   Database2: {
  //     username: "gasi",
  //     password: "rktl1234!",
  //     database: "scanner",
  //     host: "172.30.1.140",
  //     dialect: "mysql",
  //   },
  //   Database3: {
  //     username: "gasi",
  //     password: "rktl1234!",
  //     database: "AR_DB",
  //     host: "172.30.2.88",
  //     dialect: "mysql",
  //   },
  // },
};
