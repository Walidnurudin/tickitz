const express = require("express");

const Router = express.Router();

const helloController = require("./helloController");

// Router.get("/", (req, res) => {
//   res.send("Hello World!");
// });

Router.get("/", helloController.getHello);

module.exports = Router;
