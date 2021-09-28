const redis = require("../config/redis");
const helperWrapper = require("../helper/wrapper");

module.exports = {
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
};
