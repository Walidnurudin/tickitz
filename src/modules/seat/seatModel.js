const connection = require("../../config/mysql");

module.exports = {
  getSeatByBookingId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM seatBooking WHERE bookingId = ?",
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

  getSeatByScheduleId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM seatBooking WHERE scheduleId = ?",
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

  getSeatByMovieId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM seatBooking WHERE movieId = ?",
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

  getSeatByDateSchedule: (date) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM seatBooking WHERE dateSchedule = ?",
        date,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),

  getSeatByTimeSchedule: (time) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM seatBooking WHERE timeSchedule = ?",
        time,
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
