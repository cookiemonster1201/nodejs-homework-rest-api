const app = require('../../app');
const {DB_TEST_HOST} = process.env;
const request = require('supertest');
const mongoose = require('mongoose');
require("dotenv").config();
const {User} = require('../../models/user')

describe('test auth', () => {
    let server;
    beforeAll(() => {server = app.listen(3000)});
    afterAll(() => server.close());
    beforeEach((done)=> {
        mongoose.connect(DB_TEST_HOST).then(() => done());
    })

    afterEach((done)=> {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done())
        })
    })

    test('test login router', async() => {
        const credentials = {
            email: "johndoe555@gmail.com",
            password: "555"
        }
        const response = await request(app).post("/api/users/login ").send(credentials);
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.user).toBeTruthy();
        expect(response.body.user).toEqual(expect.objectContaining({
            email: expect.any(String),
            subscription: expect.any(String),
          }),)

        const user = await User.findOne({email: response.body.user.email});
        expect(user).toBeTruthy();
    })
});
