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

describe('GET /api', () => {
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

describe('GET /api/articles/:article_id', () => {
    test('Responds with a single matched article', () => {

        const expectedOutput = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
        };

        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual(expectedOutput)
            })
    });

    test('Responds with a status 404 when an article_id does not exist', () => {
        return request(app)
            .get('/api/articles/1000')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("No article found with article_id 1000");
        })
    })

    test("Responds with a status 400 when an article_id is invalid", () => {
      return request(app)
        .get("/api/articles/apples")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID requested");
        });
    });

});

describe("PATCH /api/articles/:article_id", () => {

    test("Only an object with a key of inc_votes should be passed in", () => {
      const inputObject = { pandas: -10 };

      return request(app)
        .patch("/api/articles/1")
        .send(inputObject)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid object submitted");
        });
    });

    test("Only an object with a number as the value of inc_votes should be passed in", () => {
      const inputObject = { inc_votes: 'pandas'};

      return request(app)
        .patch("/api/articles/1")
        .send(inputObject)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid object submitted");
        });
    });
    
  test("Returns with the updated article when passed in an object in the form { inc_votes: newVote }", () => {
      const inputObject = { inc_votes: -10 };
      const expectedOutput = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 90,
      };

      return request(app)
          .patch("/api/articles/1")
          .send(inputObject)
          .expect(200)
          .then(({ body }) => {
              expect(body.article).toEqual(expectedOutput);
        })
  });
});