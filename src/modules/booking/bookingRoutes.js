const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/dashboard",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.dashboard
);
Router.get(
  "/used-ticket/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.usedTicket
);

Router.get(
  "/user-id",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);

Router.get(
  "/:id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);

Router.post("/", middlewareAuth.authentication, bookingController.postBooking);
Router.get(
  "/ticket/:id",
  middlewareAuth.authentication,
  bookingController.exportTicket
);
Router.post("/midtrans-notification", bookingController.postMidtransNotif);

module.exports = Router;
