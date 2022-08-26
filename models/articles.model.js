const db = require('../db/connection');

exports.fetchArticles = (sort_by, order_by, filter_by) => {
  let qryString = 'SELECT a.*, COUNT(c.article_id) :: INT AS comment_count from articles a LEFT JOIN comments c ON a.article_id = c.article_id ';

  if (filter_by === undefined) {
    const whereClause = '';
    qryString += whereClause;
  } else {
    const whereClause = `WHERE a.topic = '${filter_by}'`;
    qryString += whereClause
  }

  if (sort_by === undefined) {
    sort_by = 'created_at';
  } else if (!["article_id", "title", "topic", "author", "created_at", "votes", "comment_count"].includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (order_by === undefined) {
    order_by = 'desc';
  } else if (!["asc", "desc"].includes(order_by)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  return db.query(qryString + `GROUP BY a.article_id ORDER BY ${sort_by} ${order_by};`).then(({ rows: articles }) => {
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