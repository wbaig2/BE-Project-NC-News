const { fetchCommentsByArticleId, addCommentByArticleId } = require('../models/comments.model');
const { checkIfArticleIdExists, checkIfUsernameExists, checkIfCommentProvided } = require("../db/seeds/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
    
  fetchCommentsByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  }).catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  const comment = req.body.body;
  
    checkIfArticleIdExists(article_id)
      .then(() => {
        checkIfUsernameExists(body.username)
          .then(() => {
            if (comment === "") {
              return Promise.reject({
                status: 404,
                msg: "No comment provided",
              });
            }
              addCommentByArticleId(article_id, body).then((comment) => {
              res.status(201).send({ comment });
            });
        }).catch(next);
    }).catch(next);
}
