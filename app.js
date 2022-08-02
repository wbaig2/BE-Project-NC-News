const express = require('express');
const app = express();
const { getTopics, getArticleById, updateVotesByArticleId } = require('./controllers/app.controller')

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', updateVotesByArticleId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }

  if (err.code === '22P02') {
    res.status(400).send({ msg: "Invalid article ID provided" });
  }
})




module.exports = app;