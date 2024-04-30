module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root123",
    DB: "job-portal",
    dialect: "mysql",
    port:5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };