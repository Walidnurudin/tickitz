const connection = require("../../config/mysql");

module.exports = {
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking AS b JOIN seatBooking AS sb ON b.id = sb.bookingId WHERE b.id = ?",
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

  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking AS b JOIN seatBooking AS sb ON b.id = sb.bookingId WHERE b.userId = ?",
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
