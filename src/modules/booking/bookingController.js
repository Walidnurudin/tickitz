const ejs = require("ejs");
const path = require("path");
const pdf = require("html-pdf");
const { v4: uuidv4 } = require("uuid");

const bookingModel = require("./bookingModel");
const scheduleModel = require("../schedule/scheduleModel");

const helperWrapper = require("../../helper/wrapper");
const midtrans = require("../../helper/midtrans");

module.exports = {
  dashboard: async (req, res) => {
    try {
      let { movieId, premiere, location } = req.query;
      movieId = movieId || "";
      premiere = premiere || "";
      location = location || "";

      const result = await bookingModel.dashboard(movieId, premiere, location);

      if (result.length < 1) {
        return helperWrapper.response(res, 200, "Data not found", []);
      }

      const newResult = result.map((item) => {
        const data = {
          ...item,
          month: item.month.slice(0, 3),
        };

        return data;
      });

      return helperWrapper.response(
        res,
        200,
        "Success get data dashboard",
        newResult
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  usedTicket: async (req, res) => {
    try {
      const { id } = req.params;
      const checkBooking = await bookingModel.getBookingById(id);

      if (checkBooking.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      if (checkBooking[0].statusUsed !== "Active") {
        return helperWrapper.response(res, 400, "Ticket already used", null);
      }

      await bookingModel.usedTicket("notActive", id);
      return helperWrapper.response(res, 200, "Success use ticket");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await bookingModel.getBookingById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const newResult = [{ ...result[0], seat: [] }];

      result.forEach((item) => {
        newResult[0].seat.push(item.seat);
      });

      return helperWrapper.response(
        res,
        200,
        `Success get data by id`,
        newResult
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  getBookingByUserId: async (req, res) => {
    try {
      const { id } = req.decodeToken;

      const booking = await bookingModel.getBookingByUserId(id);

      if (booking.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const output = [];

      booking.forEach((item) => {
        const existing = output.filter((v) => v.scheduleId === item.scheduleId);

        if (existing.length) {
          const existingIndex = output.indexOf(existing[0]);
          output[existingIndex].seat = output[existingIndex].seat.concat(
            item.seat
          );
        } else {
          // eslint-disable-next-line no-param-reassign
          if (typeof item.seat === "string") item.seat = [item.seat];
          output.push(item);
        }
      });

      return helperWrapper.response(res, 200, `Success get data by id`, output);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  postBooking: async (req, res) => {
    try {
      const {
        // userId,
        scheduleId,
        // movieId,
        dateBooking,
        timeBooking,
        paymentMethod,
        // statusPayment,
        seat,
      } = req.body;

      const { id } = req.decodeToken;

      const schedule = await scheduleModel.getScheduleById(scheduleId);
      if (schedule < 1) {
        return helperWrapper.response(
          res,
          404,
          `Schedule by id ${scheduleId} not found !`,
          null
        );
      }

      // [1]
      const setDataBooking = {
        id: uuidv4(),
        userId: id,
        scheduleId,
        movieId: schedule[0].movieId,
        totalTicket: seat.length,
        totalPayment: seat.length * schedule[0].price,
        dateBooking,
        timeBooking,
        paymentMethod,
        statusPayment: "pending",
      };

      await bookingModel.postBooking(setDataBooking);

      // [2]
      const setDataSeatBooking = {
        bookingId: setDataBooking.id,
        scheduleId,
        movieId: schedule[0].movieId,
        dateBooking,
        timeBooking,
      };

      seat.map(async (item) => {
        await bookingModel.postSeatBooking({
          ...setDataSeatBooking,
          seat: item,
        });
      });

      // [3] midtrans proses
      const resultMidtrans = await midtrans.post(
        setDataBooking.id,
        setDataBooking.totalPayment
      );

      const result = {
        id: setDataBooking.id,
        userId: id,
        scheduleId,
        movieId: schedule[0].movieId,
        dateBooking,
        timeBooking,
        paymentMethod,
        statusPayment: setDataBooking.statusPayment,
        seat,
      };

      await bookingModel.updateBooking(
        { payment: resultMidtrans },
        setDataBooking.id
      );

      return helperWrapper.response(res, 200, "Success create data", {
        ...result,
        urlRedirect: resultMidtrans,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  postMidtransNotif: async (req, res) => {
    try {
      const result = await midtrans.notif(req.body);
      const {
        order_id: bookingId,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
      } = result;

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          // [1]
          const setData = {
            statusPayment: "success",
            statusUsed: "Active",
            updatedAt: new Date(Date()),
          };
          // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI SUKSES
          await bookingModel.updateBooking(setData, bookingId);
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // [1]
        const setData = {
          statusPayment: "success",
          statusUsed: "Active",
          updatedAt: new Date(Date()),
        };
        // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI SUKSES
        await bookingModel.updateBooking(setData, bookingId);
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // [1]
        const setData = {
          statusPayment: "failed",
          statusUsed: "notActive",
          updatedAt: new Date(Date()),
        };
        // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI GAGAL
        await bookingModel.updateBooking(setData, bookingId);
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      }
      return helperWrapper.response(res, 200, "Success", null);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  exportTicket: async (req, res) => {
    try {
      const { id } = req.params;
      const fileName = `ticket-${id}.pdf`;

      // CHECK BOOKING
      const booking = await bookingModel.getBookingById(id);
      if (booking.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const newBooking = [{ ...booking[0], seat: [] }];

      booking.forEach((item) => {
        newBooking[0].seat.push(item.seat);
      });

      // PROSES EXPORT HTML to PDF
      ejs.renderFile(
        path.resolve("./src/templates/pdf/ticket.ejs"),
        { newBooking },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const options = {
              height: "11.25in",
              width: "8.5in",
              header: {
                height: "20mm",
              },
              footer: {
                height: "20mm",
              },
            };

            pdf
              .create(result, options)
              .toFile(
                path.resolve(`./public/generate/${fileName}`),
                (errPdf) => {
                  if (errPdf) {
                    console.log(errPdf);
                  } else {
                    return helperWrapper.response(
                      res,
                      200,
                      "Success export ticket",
                      { url: `http://localhost:3001/generate/${fileName}` }
                    );
                  }
                }
              );
          }
        }
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
};
