const db = require("../db/connection");
const { checkIfArticleIdExists, checkIfUsernameExists, checkExists } = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = (article_id) => {
  return db.query("SELECT * FROM comments where article_id = $1;", [article_id]).then(({ rows: comments }) => {

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
