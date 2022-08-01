const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(data);
})

describe.only('GET /api', () => {
    test('Returns a status 200 code', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
    })

    test("Returns an array of topic objects", () => {
      const expectedArray = [
        {
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        },
        {
          description: "Not dogs",
          slug: "cats",
        },
        {
          description: "what books are made of",
          slug: "paper",
        },
      ];

      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toEqual(expectedArray);
        });
    });
    test(`Responds with a 404 status when passed a bad route`, () => {
        return request(app)
            .get('/api/topical')
            .expect(404)
            .then(({ body }) => {
            expect(body.msg).toBe('Route not found');
        })

    })
})