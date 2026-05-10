const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.DB_NAME;

const connectDB = async () => {
    try {
        await client.connect();
        console.log("[+] Connected to MongoDB");
        return client.db(dbName);
    } catch (error) {
        console.error("[-] MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = { connectDB, client };