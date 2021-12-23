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

  ticketHistory: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, b.paymentMethod, b.statusPayment, b.statusUsed,  sb.seat, m.name, s.premiere FROM booking AS b JOIN seatBooking AS sb ON b.id = sb.bookingId JOIN movie AS m ON b.movieId = m.id JOIN schedule AS s ON b.scheduleId = s.id WHERE b.userId = ?`,
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
};
