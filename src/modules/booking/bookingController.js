const bookingModel = require("./bookingModel");
const scheduleModel = require("../schedule/scheduleModel");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  postBooking: async (req, res) => {
    try {
      const {
        userId,
        scheduleId,
        // movieId,
        // dateBooking,
        // timeBooking,
        paymentMethod,
        statusPayment,
        seat,
        dateSchedule,
        timeSchedule,
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
        dateBooking: new Date(Date.now()),
        timeBooking: new Date(Date.now()),
        paymentMethod,
        statusPayment,
      };

      const resultBooking = await bookingModel.postBooking(setDataBooking);

      const setDataSeatBooking = {
        bookingId: resultBooking.insertId,
        scheduleId,
        movieId: schedule[0].movieId,
        dateSchedule,
        timeSchedule,
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
