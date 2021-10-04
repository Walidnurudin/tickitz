const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");
const redis = require("../config/redis");
require("dotenv").config();

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please login first");
    }
    token = token.split(" ")[1];

    redis.get(`accessToken:${token}`, (err, result) => {
      if (!err && result !== null) {
        return helperWrapper.response(
          res,
          403,
          "Your token is destroyed please login again"
        );
      }
    });

    jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
      if (err) {
        return helperWrapper.response(res, 403, err.message);
      }
      req.decodeToken = result;
      next();
    });
  },

  isAdmin: (req, res, next) => {
    // CHECK ROLE admin | user
    const { role } = req.decodeToken;
    if (role !== "ADMIN") {
      return helperWrapper.response(res, 400, `Role user must be admin`, null);
    }
    next();
  },
};
