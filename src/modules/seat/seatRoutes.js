const express = require("express");

const Router = express.Router();

const seatController = require("./seatController");

Router.get("/schedule/:id", seatController.getSeatByScheduleId);
Router.get("/movie/:id", seatController.getSeatByMovieId);
Router.get("/dateSchedule/:date", seatController.getSeatByDateSchedule);
Router.get("/timeSchedule/:time", seatController.getSeatByTimeSchedule);

module.exports = Router;
