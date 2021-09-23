const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.get("/:id", bookingController.getBookingById);
Router.get("/user/:id", bookingController.getBookingByUserId);
Router.post("/", bookingController.postBooking);

module.exports = Router;
