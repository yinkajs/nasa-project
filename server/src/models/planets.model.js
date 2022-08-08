const path = require('path')
const fs = require('fs');

const planets = require('./planets.mongo');

const { parse } = require('csv-parse');

// check and return habitable planets
function isHabitatblePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((res, rej) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitatblePlanet(data)) {
                    savePlanet(data)
                }
            })
            .on('error', (err) => {
                console.log(err);
                rej(err)
            })
            .on('end', async () => {
                const countPlanetsLoad = (await getAllPlanets()).length
                console.log(`${countPlanetsLoad} habitable planets found!`)
                res()
            })
    })
}

async function getAllPlanets() {
    return await planets.find({},{
            '_id': 0,
            '__v': 0
        })
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch (error) {
        console.error('Not able to save planet' + error);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
