const redis = require("../config/redis");
const helperWrapper = require("../helper/wrapper");

module.exports = {
  // MOVIE
  getMovieRedis: (req, res, next) => {
    redis.get(`getMovie:${JSON.stringify(req.query)}`, (err, result) => {
      if (!err && result !== null) {
        console.log("Data ada didalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data",
          newResult.result,
          newResult.pageInfo
        );
      }
      console.log("Data tidak ada didalam redis");
      next();
    });
  },

  getMovieByIdRedis: (req, res, next) => {
    const { id } = req.params;

    redis.get(`getMovie:${id}`, (err, result) => {
      if (!err && result !== null) {
        console.log("Data ada didalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data by id",
          newResult
        );
      }
      console.log("Data tidak ada didalam redis");
      next();
    });
  },

  clearMovieRedis: (req, res, next) => {
    redis.keys("getMovie:*", (err, result) => {
      // result = ["getMovie:1", ....]
      if (result.length > 0) {
        // PROSES DELETE KEYS
        result.forEach((item) => {
          redis.del(item);
        });
      }
      next();
    });
  },

  // SCHEDULE
  getScheduleRedis: (req, res, next) => {
    redis.get(`getSchedule:${JSON.stringify(req.query)}`, (err, result) => {
      if (!err && result !== null) {
        console.log("Data ada didalam redis");
        const newResult = JSON.parse(result);

        // convert time "string" to "array"
        const newResult2 = newResult.result.map((item) => {
          if (item.time.split(",").length > 1) {
            const data = {
              ...item,
              time: item.time.split(","),
            };

            return data;
          }
          const data = {
            ...item,
            time: [item.time],
          };
          return data;
        });

        return helperWrapper.response(
          res,
          200,
          "Success get data",
          newResult2,
          newResult.pageInfo
        );
      }
      console.log("Data tidak ada didalam redis");
      next();
    });
  },

  getScheduleByIdRedis: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getSchedule:${id}`, (err, result) => {
      if (!err && result !== null) {
        console.log("Data ada didalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(res, 200, "Success get data", newResult);
      }
      console.log("Data tidak ada didalam redis");
      next();
    });
  },

  getScheduleByMovieIdRedis: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getSchedule:movieId${id}`, (err, result) => {
      if (!err && result !== null) {
        console.log("Data ada didalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(res, 200, "Success get data", newResult);
      }
      console.log("Data tidak ada didalam redis");
      next();
    });
  },

  clearScheduleRedis: (req, res, next) => {
    redis.keys("getSchedule:*", (err, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
      next();
    });
  },
};
