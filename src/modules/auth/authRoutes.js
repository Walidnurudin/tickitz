const express = require("express");

const Router = express.Router();

const authController = require("./authController");
const middlewareAuth = require("../../middleware/auth");

Router.post("/register", authController.register);
Router.get("/activate/:id", authController.activate);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.post(
  "/refresh",
  middlewareAuth.authentication,
  authController.refreshToken
);

module.exports = Router;
