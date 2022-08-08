const http = require('http');

const app = require('./app.js');

const { mongoConnect } = require('../src/services/mongo')

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect()
    
    // load planets data on load
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening at port ${PORT}...`)
    })
}


startServer()