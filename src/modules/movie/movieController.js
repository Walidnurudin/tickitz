const movieModel = require("./movieModel");
const helperWrapper = require("../../helper/wrapper");
const redis = require("../../config/redis");
const deleteFile = require("../../helper/uploads/deleteFile");

module.exports = {
  getAllMovie: async (req, res) => {
    try {
      let { page, limit, search, month, sort } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || "name ASC";
      search = search || "";
      month = month || "";

      let offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(search);
      const totalPage = Math.ceil(totalData / limit);

      if (totalPage < page) {
        offset = 0;
        page = 1;
      }

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(
        limit,
        offset,
        search,
        month,
        sort
      );

      if (result.length < 1) {
        return helperWrapper.response(
          res,
          200,
          `Data not found !`,
          [],
          pageInfo
        );
      }

      redis.setex(
        `getMovie:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return helperWrapper.response(
        res,
        200,
        "Success get data",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getMovieById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      // PROSES UNTUK MENYIMPAN DATA KE DALAM REDIS
      redis.setex(`getMovie:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(res, 200, `Success get data by id`, result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  postMovie: async (req, res) => {
    try {
      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = req.body;

      const setData = {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
        image: req.file ? req.file.filename : null,
      };

      const result = await movieModel.postMovie(setData);

      return helperWrapper.response(res, 200, "Success create data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }

      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = req.body;

      const setData = {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
        image: req.file ? req.file.filename : null,
        updatedAt: new Date(Date.now()),
      };

      Object.keys(setData).forEach((property) => {
        if (!setData[property]) {
          delete setData[property];
        }
      });

      if (req.file && checkId[0].image) {
        deleteFile(`public/uploads/movie/${checkId[0].image}`);
      }

      const result = await movieModel.updateMovie(setData, id);
      return helperWrapper.response(res, 200, `Success update data`, result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }
      if (checkId[0].image) {
        deleteFile(`public/uploads/movie/${checkId[0].image}`);
      }

      const result = await movieModel.deleteMovie(id);
      return helperWrapper.response(res, 200, "Success delete data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
};
