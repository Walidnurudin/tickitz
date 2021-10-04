const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/dashboard",
  // middlewareAuth.authentication,
  // middlewareAuth.isAdmin,
  bookingController.dashboard
);
Router.get(
  "/used-ticket/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.usedTicket
);

Router.get("/:id", bookingController.getBookingById);
Router.get("/user-id/:id", bookingController.getBookingByUserId);
Router.post("/", bookingController.postBooking);

module.exports = Router;
