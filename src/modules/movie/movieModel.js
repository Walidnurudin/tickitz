const connection = require("../../config/mysql");

module.exports = {
  getAllMovie: (limit, offset, search) =>
    new Promise((resolve, reject) => {
      let query;
      if (search && limit) {
        query = `SELECT * FROM movie WHERE name LIKE '%${search}%' ORDER BY name ASC, releaseDate DESC LIMIT ? OFFSET ?`;
      } else if (limit || limit === 0) {
        query =
          "SELECT * FROM movie ORDER BY name ASC, releaseDate DESC limit ? offset ?";
      } else if (search) {
        query = `SELECT * FROM movie WHERE name LIKE '%${search}%' ORDER BY name ASC, releaseDate DESC`;
      } else {
        query = "SELECT * FROM movie ORDER BY name ASC, releaseDate DESC";
      }
      connection.query(query, [limit, offset], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),

  getMovieById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie WHERE id = ?",
        id,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),

  getCountMovie: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT COUNT(*) AS total FROM movie", (err, result) => {
        if (!err) {
          resolve(result[0].total);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),

  postMovie: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO movie SET ?", data, (err, result) => {
        if (!err) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),

  updateMovie: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query("UPDATE movie SET ? WHERE id = ?", [data, id], (err) => {
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

  deleteMovie: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM movie WHERE id = ?", id, (err) => {
        if (!err) {
          resolve(id);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),
};
