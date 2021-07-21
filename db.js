const { MongoClient } = require('mongodb');
let db;

async function connectToDB() {
    const url = 'mongodb+srv://Macsick121:AsDf1234@cluster0.dtorr.mongodb.net/adding_to_cart?retryWrites=true&w=majority';
    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    db = client.db();
    console.log(`Successfully connected to MongoDB with address ${url}`);
}

function getDb() {
    return db;
}

module.exports = { getDb, connectToDB };
