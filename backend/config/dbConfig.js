const { Sequelize } = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(
    process.env.DB_NAME || "carbon_credit_db", 
    process.env.DB_USER || "carbonuser", 
    process.env.DB_PASSWORD || "carbonpass123", 
    { 
        host: process.env.DB_HOST || "localhost", 
        port: Number(process.env.DB_PORT) || 5432, 
        dialect: process.env.DB_DIALECT || "postgres", 
        logging: process.env.NODE_ENV == "development" ? console.log : false, 
        pool: {
            max: 5,            // maximum of 5 simulataneous connections - 5 queries can use the DB at the same time
            min: 0,            // minimum of 0 idle connections kept open - dont keep any unless needed
            acquire: 30000,    // maximum time (ms) to wait for a free connection
            idle: 10000        // time (ms) an unused connection can sit before closing
        }

    }
)

module.exports = sequelize
