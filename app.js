const express = require('express');
const app = express();
const cors = require('cors');

const { getEndpoints } = require("./api")
const { getTopics } = require("./controllers/topics.controller");
const { getArticles, getArticleById, updateVotesByArticleId } = require("./controllers/articles.controller");
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentByCommentId} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

app.use(cors());

app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch('/api/articles/:article_id', updateVotesByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentByCommentId);

app.get('/api/users', getUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
console.log(err);

  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }

  if (err.code === '22P02') {
    res.status(400).send({ msg: "Invalid ID provided" });
  }

  if (err.code === "23503") {
    res.status(404).send({ msg: "Article not found" });
  }

})




module.exports = app;