const express = require('express');
const app = express();
const { getTopics } = require('./controllers/app.controller')

app.use(express.json());

app.get('/api/topics', getTopics);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});




module.exports = app;