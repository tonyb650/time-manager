const mongoose = require('mongoose');
// const dbName = "task";
const dotenv = require('dotenv')

dotenv.config();

const uri = process.env.DB_URI;

async function connect() {
    try {
        await mongoose.connect(uri);  // REMOVED THIS: {useNewUrlParser: true, useUnifiedTopology: true}
        console.log(`Established a connection to the MongoDB.`)// dbName = ${dbName}`)
    } catch (err) {
        console.log(`Error connecting to MongDB`, err );
    }
}
connect();