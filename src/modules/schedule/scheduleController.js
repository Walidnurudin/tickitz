const scheduleModel = require("./scheduleModel");
const movieModel = require("../movie/movieModel");
const helperWrapper = require("../../helper/wrapper");
const redis = require("../../config/redis");

module.exports = {
  getAllSchedule: async (req, res) => {
    try {
      let { page, limit, searchLocation, searchMovieId, sort } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      searchLocation = searchLocation || "";
      searchMovieId = searchMovieId || "";
      sort = sort || "price ASC";

      let offset = page * limit - limit;
      const totalData = await scheduleModel.getCountSchedule(
        searchLocation,
        searchMovieId
      );
      const totalPage = Math.ceil(totalData / limit);

      if (totalPage < page) {
        offset = 0;
        page = 1;
      }

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchLocation,
        searchMovieId,
        sort
      );

      const newResult = result.map((item) => {
        const data = {
          ...item,
          time: item.time.split(","),
        };

        return data;
      });

      if (result.length < 1) {
        return helperWrapper.response(res, 404, `Data not found !`, null);
      }

      redis.setex(
        `getSchedule:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return helperWrapper.response(
        res,
        200,
        "Success get data",
        newResult,
        pageInfo
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

  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await scheduleModel.getScheduleById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const newResult = result.map((item) => {
        const data = {
          ...item,
          time: item.time.split(","),
        };

        return data;
      });

      redis.setex(`getSchedule:${id}`, 3600, JSON.stringify(newResult));

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

  getScheduleByMovieId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await scheduleModel.getScheduleByMovieId(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by movieId ${id} not found !`,
          null
        );
      }

      const newResult = result.map((item) => {
        const data = {
          ...item,
          time: item.time.split(","),
        };

        return data;
      });

      redis.setex(`getSchedule:movieId${id}`, 3600, JSON.stringify(newResult));

      return helperWrapper.response(
        res,
        200,
        `Success get data by movieId`,
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

  postSchedule: async (req, res) => {
    try {
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        req.body;

      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
      };

      const checkMovieId = await movieModel.getMovieById(movieId);
      if (checkMovieId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by movieId ${movieId} not found !`,
          null
        );
      }

      const result = await scheduleModel.postSchedule(setData);

      return helperWrapper.response(res, 200, "Success create data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await scheduleModel.getScheduleById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        req.body;

      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
        updatedAt: new Date(Date.now()),
      };

      const checkMovieId = await movieModel.getMovieById(movieId);
      if (checkMovieId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by movieId ${movieId} not found !`,
          null
        );
      }

      Object.keys(setData).forEach((property) => {
        if (!setData[property]) {
          delete setData[property];
        }
      });

      const result = await scheduleModel.updateSchedule(setData, id);
      return helperWrapper.response(res, 200, `Success update data`, result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await scheduleModel.getScheduleById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const result = await scheduleModel.deleteSchedule(id);
      return helperWrapper.response(res, 200, "Success delete data", result);
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
