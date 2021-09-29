const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareRedis.getAllScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.get("/movie-id/:id", scheduleController.getScheduleByMovieId);
Router.post("/", scheduleController.postSchedule);
Router.patch(
  "/:id",
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;
