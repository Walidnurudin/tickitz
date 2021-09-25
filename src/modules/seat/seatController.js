const seatModel = require("./seatModel");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  getSeatBooking: async (req, res) => {
    try {
      let { scheduleId, movieId, dateBooking, timeBooking } = req.query;
      scheduleId = scheduleId || "";
      movieId = movieId || "";
      dateBooking = dateBooking || "";
      timeBooking = timeBooking || "";

      const result = await seatModel.getSeatBooking(
        scheduleId,
        movieId,
        dateBooking,
        timeBooking
      );

      if (result.length < 1) {
        return helperWrapper.response(res, 404, `Data not found !`, null);
      }

      return helperWrapper.response(res, 200, `Success get data by id`, result);
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
