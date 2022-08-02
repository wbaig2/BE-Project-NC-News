const express = require('express');
const app = express();
const { getTopics, getArticleById } = require('./controllers/app.controller')

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }

  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid ID requested'})
  }
})




module.exports = app;