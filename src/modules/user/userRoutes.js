const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadUser");

Router.get("/", middlewareAuth.authentication, userController.getUserById);
Router.patch("/", middlewareAuth.authentication, userController.updateProfile);
Router.patch(
  "/update-image",
  middlewareAuth.authentication,
  middlewareUpload,
  userController.updateImage
);
Router.patch(
  "/update-password",
  middlewareAuth.authentication,
  userController.updatePassword
);
Router.get(
  "/ticket-history",
  middlewareAuth.authentication,
  userController.getTicketHistory
);

module.exports = Router;
