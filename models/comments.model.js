const db = require("../db/connection");
const { checkIfArticleIdExists } = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = (article_id) => {
  return db.query("SELECT * FROM comments where article_id = $1;", [article_id]).then(({ rows: comments }) => {

    if (comments.length === 0) {
      return checkIfArticleIdExists(article_id)

    }
    
    return comments;
  })
};
