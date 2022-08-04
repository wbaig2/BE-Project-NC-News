const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db.query("SELECT * FROM comments where article_id = $1;", [article_id]).then(({ rows: comments }) => {
    if (comments.length === 0 ) {
      return Promise.reject({
        status: 404,
        msg: `No comments found for article_id ${article_id} - article_id does not exist`,
      });
    }
    return comments;
  });
};
