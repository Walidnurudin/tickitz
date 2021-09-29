const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewateAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadMovie");

Router.get("/", middlewareRedis.getMovieRedis, movieController.getAllMovie);
Router.get(
  "/:id",
  middlewateAuth.authentication,
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.post(
  "/",
  middlewateAuth.authentication,
  middlewateAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  middlewareUpload,
  movieController.postMovie
);
Router.patch(
  "/:id",
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
);
Router.delete(
  "/:id",
  middlewareRedis.clearMovieRedis,
  movieController.deleteMovie
);

module.exports = Router;
