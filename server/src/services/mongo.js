const mongoose = require("mongoose")

const MONGO_URL = "mongodb+srv://nasa-api:avoGZk8dDTlxiIox@nasacluster.pnvdc.mongodb.net/nasa?retryWrites=true&w=majority"

mongoose.connection.once('open', () => {
    console.log('MongoDB Connection Succeeded.')
});

mongoose.connection.on('error', (err) => {
    console.log('Error in DB connection: ' + err)
})

async function mongoConnect() {
    // Connect MongoDB at default port 27017.
    await mongoose.connect(MONGO_URL);

}

async function mongoDisconnect() {
    mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}