const { MongoClient } = require('mongodb');

const username = 'asif';
const password = 'vora';
const MONGODB_URI = `mongodb+srv://${username}:${password}@cluster0.spkzc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// The database to use
const dbName = 'test';

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect();

const db = client.db(dbName);

module.exports = db;
