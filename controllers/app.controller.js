const express = require('express');
const db = require('../db/connection');
const app = require('../app');

const { fetchTopics, fetchArticlesById, changeVotesByArticleId } = require('../models/app.model');



exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics })
        })  
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
    fetchArticlesById(article_id)
        .then((article) => {
        res.status(200).send({ article });
  }).catch(next);
};

exports.updateVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const votes = req.body;
    
    if (!(votes.hasOwnProperty("inc_votes")) || typeof votes["inc_votes"] !== "number") {
      res.status(400).send({ msg: "Invalid object submitted" });
    }

    changeVotesByArticleId(article_id, votes)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
}