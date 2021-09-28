const express = require("express");

const Router = express.Router();

const userController = require("./userController");

Router.patch("/:id", userController.updateProfile);
Router.patch("/update-password/:id", userController.updatePassword);

module.exports = Router;
