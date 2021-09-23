const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.post("/", bookingController.postBooking);

module.exports = Router;
