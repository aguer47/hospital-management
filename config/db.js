const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

let database;

async function connectDB() {
  try {
    await client.connect();

    database = client.db("hospitalDB");

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

function getDB() {
  return database;
}

module.exports = {
  connectDB,
  getDB
};