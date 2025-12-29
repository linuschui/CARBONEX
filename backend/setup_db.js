const { Client } = require('pg')
const fs = require("fs")
const path = require("path")
require("dotenv").config()

async function setupDatabase() {
    const client = new Client({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || "carbon_credit_db",
        user: process.env.DB_USER || "carbonuser",
        password: process.env.DB_PASSWORD || "carbonpass123"
    })

    try {
        // Step 1 : Connect To DB
        console.log("Connecting to database...");
        await client.connect();
        console.log("✅ Connected successfully!");
        // Step 2 : Execute SQL File
        const sqlFile = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        console.log('Executing SQL script...');
        await client.query(sql);
        console.log("✅ Database setup completed successfully!");
    } catch (error) {
        console.error("❌ Error setting up database: ", error);
        process.exit(1)
    } finally {
        await client.end()
        console.log("✅ Database connection closed");
    }
}

setupDatabase()
