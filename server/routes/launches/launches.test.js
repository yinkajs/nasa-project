const request = require('supertest')
const app = require('../../src/app')
const { mongoConnect, mongoDisconnect } = require('../../src/services/mongo')

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })
    describe('Test GET /launches', () => {
        test('It should respond with a 200 success', async () => {
            await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: "USS Enterprise",
            rocket: "NSS 1701-D",
            target: "Kepler-62 f",
            launchDate: "January 4,2028",
        };

        const launchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "NSS 1701-D",
            target: "Kepler-62 f",
        };

        const launchWithInvalidDate = {
            mission: "USS Enterprise",
            rocket: "NSS 1701-D",
            target: "Kepler-62 f",
            launchDate: "zoot",
        };

        test('It should respond with a 201 success', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);


            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(requestDate).toBe(responseDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It should catch missing required missing properties', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "Missing required launch properties"
            });
        });

        test('It should catch invalid launch Date', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "Invalid launch Date"
            });
        });
    });
})


//TODO:
//Use .toStrictEqual to test if objects have the same types as well as structure.
//Use .toMatchObject to check that a JavaScript object matches a subset of the properties of an object.
//It will match received objects with properties that are not in the expected object.