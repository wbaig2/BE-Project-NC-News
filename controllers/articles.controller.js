const { fetchArticles, fetchArticlesById, changeVotesByArticleId } = require('../models/articles.model');

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order_by } = req.query;
  const filter_by = req.query.topic;

  fetchArticles(sort_by, order_by, filter_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};


exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
    fetchArticlesById(article_id)
        .then((article) => {
        res.status(200).send({ article });
  }).catch(next);
};

exports.updateVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const votes = req.body;
    
    if (!(votes.hasOwnProperty("inc_votes")) || typeof votes["inc_votes"] !== "number") {
      res.status(400).send({ msg: "Invalid object submitted" });
    }

    changeVotesByArticleId(article_id, votes)
      .then((article) => {
        res.status(200).send({ article });
      })
    .catch(next);
}
