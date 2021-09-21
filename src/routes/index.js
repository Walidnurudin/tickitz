const express = require("express");

const Router = express.Router();
const helloRoutes = require("../modules/hello/helloRoutes");
const movieRoutes = require("../modules/movie/movieRoutes");

// Router.get("/", (req, res) => {
//   res.send("Hello World!");
// });

Router.use("/hello", helloRoutes);
Router.use("/movie", movieRoutes);

module.exports = Router;
