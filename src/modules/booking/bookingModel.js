const connection = require("../../config/mysql");

module.exports = {
  dashboard: (movieId, premiere, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTHNAME(b.createdAt) AS month, SUM(b.totalPayment) AS total FROM booking AS b JOIN schedule AS s ON b.movieId = s.movieId WHERE YEAR(b.createdAt) = YEAR(NOW()) AND b.movieId LIKE '%${movieId}%' AND s.premiere LIKE '%${premiere}%' AND s.location LIKE '%${location}%' GROUP BY MONTH(b.createdAt)`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),

  usedTicket: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET statusUsed = ? WHERE id = ?",
        [data, id],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),

  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, b.statusUsed, sb.seat FROM booking AS b JOIN seatBooking AS sb ON b.id = sb.bookingId WHERE b.id = ?",
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
        "SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, b.statusUsed, sb.seat FROM booking AS b JOIN seatBooking AS sb ON b.id = sb.bookingId WHERE b.userId = ?",
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

  updateBooking: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
};
