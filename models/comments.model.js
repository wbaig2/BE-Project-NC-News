const db = require("../db/connection");
const { checkIfArticleIdExists, checkIfCommentIdExists } = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = (article_id) => {
  return db.query("SELECT * FROM comments c INNER JOIN users u ON c.author = u.author where c.article_id = $1 ORDER BY c.created_at desc;", [article_id]).then(({ rows: comments }) => {
    if (comments.length === 0) {
      return checkIfArticleIdExists(article_id)
    }
    return comments;
  })
};

exports.addCommentByArticleId = (article_id, newComment) => {
  const { body, username } = newComment;
    return db.query('INSERT INTO comments (body, article_id, author) VALUES($1, $2, $3) RETURNING *;', [body, article_id, username])
      .then(({ rows }) => {
        const comment = rows[0]
        return comment;
      })
}

exports.removeCommentByCommentId = (comment_id) => {

  return checkIfCommentIdExists(comment_id)
    .then(() => {
      return db
        .query("DELETE FROM comments where comment_id = $1;", [comment_id])

    }).then(({ rows: comment }) => comment);
    
}

