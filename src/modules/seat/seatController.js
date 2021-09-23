const seatModel = require("./seatModel");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  getSeatByScheduleId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await seatModel.getSeatByScheduleId(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
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

  getSeatByMovieId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await seatModel.getSeatByMovieId(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
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

  getSeatByDateSchedule: async (req, res) => {
    try {
      const { date } = req.params;
      const result = await seatModel.getSeatByDateSchedule(date);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by date ${date} not found !`,
          null
        );
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

  getSeatByTimeSchedule: async (req, res) => {
    try {
      const { time } = req.params;
      const result = await seatModel.getSeatByTimeSchedule(time);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by time ${time} not found !`,
          null
        );
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
