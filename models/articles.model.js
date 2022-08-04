const db = require('../db/connection');

exports.fetchArticles = () => {
  return db.query('SELECT a.*, COUNT(c.article_id) :: INT AS comment_count from articles a LEFT JOIN comments c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at desc;').then(({ rows: articles }) => {
    console.log(articles)
    return articles;
  })
}

exports.fetchArticlesById = (article_id) => {
    return db.query('SELECT a.*, COUNT(c.article_id) :: INT AS comment_count from articles a INNER JOIN comments c ON a.article_id = c.article_id where a.article_id = $1 GROUP BY a.article_id;', [article_id]).then(({ rows }) => {
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