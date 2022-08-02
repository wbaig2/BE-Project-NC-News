const express = require('express');
const db = require('../db/connection');
const app = require('../app');

const { fetchTopics, fetchArticlesById } = require('../models/app.model');



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