// const midtrans = require("midtrans-client");

module.exports = {
  post: () =>
    new Promise((resolve, reject) => {
      console.log("POST MIDTRANS RUN");
    }),

  notif: () =>
    new Promise((resolve, reject) => {
      console.log("NOTIF MIDTRANS RUN");
    }),
};
