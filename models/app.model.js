const express = require('express');
const db = require('../db/connection');
const app = require('../app');

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
        .then(({ rows: topics }) => {
            return topics;
        })
}

exports.fetchArticlesById = (article_id) => {
    return db.query('SELECT * from articles where article_id = $1;', [article_id]).then(({ rows }) => {
        const article = rows[0];
        if (!article) {
            return Promise.reject({
                status: 404,
                msg: `No article found with article_id ${article_id}`
            })
        }
        return article;
    })
}