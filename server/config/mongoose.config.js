const mongoose = require('mongoose');
const dbName = "task";

async function connect() {
    try {
        console.log("entering try block");
        await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);  // REMOVED THIS: {useNewUrlParser: true, useUnifiedTopology: true}
        console.log(`Established a connection to the MongoDB. dbName = ${dbName}`)
    } catch (err) {
        console.log(`Error connecting to MongDB`, err );
    }
}
connect();

// mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log(`Established a connection to the MongoDB. dbName= ${dbName}`))
//     .catch(err => console.log(`Error connecting to MongDB`, err ));