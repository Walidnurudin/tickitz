const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");

Router.get("/", scheduleController.getAllSchedule);
Router.get("/:id", scheduleController.getScheduleById);
Router.get("/movie/:movieId", scheduleController.getScheduleByMovieId);
Router.post("/", scheduleController.postSchedule);
Router.patch("/:id", scheduleController.updateSchedule);
Router.delete("/:id", scheduleController.deleteSchedule);

module.exports = Router;
