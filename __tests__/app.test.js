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

describe("GET /api/articles", () => {
  test("Responds with an array of article objects, sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy('created_at', {descending: true});
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
    test("Responds with a single matched article", () => {

      const expectedOutput = {
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      };

      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(expect.objectContaining(expectedOutput));
        });
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
          expect(body.msg).toBe("Invalid article ID provided");
        });
    });

});

describe("PATCH /api/articles/:article_id", () => {

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
        });
    });

    test("Responds with a status 404 when trying to update an article_id which does not exist", () => {
        const inputObject = { inc_votes: -10 };

        return request(app)
        .patch("/api/articles/500")
        .send(inputObject)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Unable to update article_id 500 - article not found"
          );
        });
    });

    test("Responds with a status 400 when trying to update an article_id which is invalid", () => {
        const inputObject = { inc_votes: -10 };
        
      return request(app)
        .patch("/api/articles/pineapples")
        .send(inputObject)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid article ID provided");
        });
    });
    
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
});

describe('GET /api/users', () => {
    test('Returns a status 200', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
    })

    test('Returns an array of users', () => {
        const expectedArray = [
       {
         "avatar_url": "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
         "name": "jonny",
         "username": "butter_bridge",
        },
       
       {
         "avatar_url": "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
         "name": "sam",
         "username": "icellusedkars",
       },
        
        {
         "avatar_url": "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
         "name": "paul",
         "username": "rogersop",
       },
       
        {
         "avatar_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
         "name": "do_nothing",
         "username": "lurker",
        },
    ];
        
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            expect(body.users).toEqual(expectedArray)
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('Responds with a single matched article, including the number of comments', () => {

        const expectedOutput = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          comment_count: expect.any(Number),
        };

        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual(expectedOutput)
            })
    });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Responds with an array of comments when an article_id is matched", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_id: 1,
            })
          );
        });
      });
  });

  test("Responds with a status 200 when a valid article_id does not have any comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
  });

  test("Responds with a status 404 when an article_id does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("Responds with a status 400 when an article_id is invalid", () => {
    return request(app)
      .get("/api/articles/apples/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID provided");
      });
  });

});


describe("POST /api/articles/:article_id/comments", () => {
  test('Responds with the comment when a comment is posted with a matching article_id', () => {
    const newComment = {
      username: 'lurker',
      body: 'I like lurking and I cannot lie',
    };
    
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: "lurker",
            body: "I like lurking and I cannot lie",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: 1,
          })
        );
      });
  })

  test("Responds with a status 400 when an invalid article_id is provided", () => {
    const newComment = {
      username: "lurker",
      body: "I like lurking and I cannot lie",
    };

    return request(app)
      .post("/api/articles/bananas/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID provided");
      });
  });

  test("Responds with a status 404 when an article_id does not exist", () => {
    const newComment = {
      username: "lurker",
      body: "I like lurking and I cannot lie",
    };

    return request(app)
      .post("/api/articles/500/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("Responds with a status 404 when the username provided does not exist", () => {
    const newComment = {
      username: "spiderman",
      body: "I like lurking and I cannot lie",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });

  test("Responds with a status 404 when the body (comment) is empty", () => {
    const newComment = {
      username: "lurker",
      body: "",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment provided");
      });
  });

});