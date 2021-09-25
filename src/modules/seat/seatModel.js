const connection = require("../../config/mysql");

module.exports = {
  getSeatBooking: (scheduleId, movieId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT seatBooking.id, seatBooking.seat FROM seatBooking WHERE scheduleId LIKE '%${scheduleId}%' AND movieId LIKE '%${movieId}%' AND dateBooking LIKE '%${dateBooking}%' AND timeBooking LIKE '%${timeBooking}%'`,
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
