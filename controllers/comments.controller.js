const { fetchCommentsByArticleId, addCommentByArticleId} = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
    
  fetchCommentsByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  }).catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  
  addCommentByArticleId(article_id, body).then((comment) => {
    res.status(201).send({ comment });
  }).catch(next);

}
