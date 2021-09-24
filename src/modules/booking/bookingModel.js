const connection = require("../../config/mysql");

module.exports = {
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        // "SELECT * FROM booking WHERE id = ?",
        // "SELECT * FROM booking JOIN seatBooking ON booking.id = seatBooking.bookingId",
        "SELECT * FROM booking, seatBooking WHERE booking.id = ?",
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
        // "SELECT * FROM booking WHERE userId = ?",
        // "SELECT * FROM booking JOIN seatBooking ON booking.userId = seatBooking.id",
        "SELECT * FROM booking, seatBooking WHERE booking.userId = ?",
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
