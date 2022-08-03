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

exports.changeVotesByArticleId = (article_id, votes) => {
    const voteCount = votes["inc_votes"];

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 where article_id = $2 RETURNING *;",
      [voteCount, article_id]
    )
      .then(({ rows }) => {
        const article = rows[0];
        if (!article) {
          return Promise.reject({
            status: 404,
            msg: `Unable to update article_id ${article_id} - article not found`,
          });
        }
        return article;
    });
};

exports.fetchUsers = () => {
    return db.query('SELECT * from users;').then(({ rows: users }) => {
        console.log(users)
        return users;
    })
}