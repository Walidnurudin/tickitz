const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewateAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.get(
  "/movie-id/:id",
  middlewareRedis.getScheduleByMovieIdRedis,
  scheduleController.getScheduleByMovieId
);
Router.post(
  "/",
  middlewateAuth.authentication,
  middlewateAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.postSchedule
);
Router.patch(
  "/:id",
  middlewateAuth.authentication,
  middlewateAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewateAuth.authentication,
  middlewateAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;
