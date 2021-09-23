const connection = require("../../config/mysql");

module.exports = {
  postBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),

  postSeatBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO seatBooking SET ?", data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
      });
    }),
};
