const bookingModel = require("./bookingModel");
const scheduleModel = require("../schedule/scheduleModel");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await bookingModel.getBookingById(id);
      if (booking.length < 1) {
        return helperWrapper.response(res, 404, `Data by id not found !`, null);
      }

      return helperWrapper.response(
        res,
        200,
        `Success get data by id`,
        booking
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
      const { id } = req.params;

      const booking = await bookingModel.getBookingByUserId(id);
      if (booking.length < 1) {
        return helperWrapper.response(res, 404, `Data not found !`, null);
      }

      return helperWrapper.response(
        res,
        200,
        `Success get data by id`,
        booking
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

  postBooking: async (req, res) => {
    try {
      const {
        userId,
        scheduleId,
        // movieId,
        dateBooking,
        timeBooking,
        paymentMethod,
        statusPayment,
        seat,
      } = req.body;

      const schedule = await scheduleModel.getScheduleById(scheduleId);
      if (schedule < 1) {
        return helperWrapper.response(
          res,
          404,
          `Schedule by id ${scheduleId} not found !`,
          null
        );
      }

      const setDataBooking = {
        userId,
        scheduleId,
        movieId: schedule[0].movieId,
        totalTicket: seat.length,
        totalPayment: seat.length * schedule[0].price,
        dateBooking,
        timeBooking,
        paymentMethod,
        statusPayment,
      };

      const resultBooking = await bookingModel.postBooking(setDataBooking);

      const setDataSeatBooking = {
        bookingId: resultBooking.insertId,
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

      const result = {
        ...setDataBooking,
        ...setDataSeatBooking,
        seat,
      };

      return helperWrapper.response(res, 200, "Success get data", result);
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
