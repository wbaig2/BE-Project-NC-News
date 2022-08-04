const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * from users;").then(({ rows: users }) => {
    return users;
  });
};
