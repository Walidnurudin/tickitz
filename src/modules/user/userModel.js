const connection = require("../../config/mysql");

module.exports = {
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE id = ?", id, (err, result) => {
        if (!err) {
          const newResult = result;
          delete newResult[0].password;
          resolve(newResult);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),

  updateProfile: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query("UPDATE user SET ? WHERE id = ?", [data, id], (err) => {
        if (!err) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),
};
