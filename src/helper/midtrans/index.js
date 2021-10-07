const midtransClient = require("midtrans-client");
require("dotenv").config();

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDT_IS_PRODUCTION === "true",
  serverKey: "SB-Mid-server-e_aRBbXyfDmpWG_mAoBy3G3D",
  clientKey: "SB-Mid-client-t4bwdc0yH4sno94V",
});

module.exports = {
  post: (id, amount) =>
    new Promise((resolve, reject) => {
      console.log(id, amount);
      const parameter = {
        transaction_details: {
          order_id: id,
          gross_amount: amount,
        },
        credit_card: {
          secure: true,
        },
      };

      snap
        .createTransaction(parameter)
        .then((result) => {
          resolve(result.redirect_url);
        })
        .catch((err) => {
          // console.log(err);
          reject(err);
        });
    }),

  notif: (body) =>
    new Promise((resolve, reject) => {
      snap.transaction
        .notification(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }),
};
