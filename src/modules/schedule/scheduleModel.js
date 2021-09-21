const connection = require("../../config/mysql");

module.exports = {
  getAllSchedule: (limit, offset, search) =>
    new Promise((resolve, reject) => {
      let query;
      if (search && limit) {
        query = `SELECT * FROM schedule WHERE movieId LIKE '%${search}%' OR location LIKE '%${search}%' ORDER BY price ASC LIMIT ? OFFSET ?`;
      } else if (limit || limit === 0) {
        query = "SELECT * FROM schedule ORDER BY price ASC LIMIT ? OFFSET ?";
      } else if (search) {
        query = `SELECT * FROM schedule WHERE movieId LIKE '%${search}%' OR location LIKE '%${search}%' ORDER BY price ASC`;
      } else {
        query = "SELECT * FROM schedule ORDER BY price ASC";
      }
      connection.query(query, [limit, offset], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),

  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id = ?",
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

  getScheduleByMovieId: (movieId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE movieId = ?",
        movieId,
        (err, resullt) => {
          if (!err) {
            resolve(resullt);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),

  getCountSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule",
        (err, result) => {
          if (!err) {
            resolve(result[0].total);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),

  postSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (err, result) => {
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

  updateSchedule: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
        [data, id],
        (err) => {
          if (!err) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),

  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM schedule WHERE id = ?", id, (err) => {
        if (!err) {
          resolve(id);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),
};
