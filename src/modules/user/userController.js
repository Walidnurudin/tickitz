const bcrypt = require("bcrypt");
const modelUser = require("./userModel");
const helperWrapper = require("../../helper/wrapper");
const deleteFile = require("../../helper/uploads/deleteFile");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.decodeToken;

      const result = await modelUser.getUserById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Get data user by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        res,
        200,
        `Success get data user by id`,
        result
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

  updateProfile: async (req, res) => {
    try {
      const { id } = req.decodeToken;
      const { firstName, lastName, email, phoneNumber } = req.body;

      const user = await modelUser.getUserById(id);
      if (user.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Get data user by id ${id} not found`,
          null
        );
      }

      const setData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        updatedAt: new Date(Date()),
      };

      Object.keys(setData).forEach((property) => {
        if (!setData[property]) {
          delete setData[property];
        }
      });

      const result = await modelUser.updateProfile(setData, id);

      return helperWrapper.response(res, 200, `Success update profile`, result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },

  updateImage: async (req, res) => {
    try {
      const { id } = req.decodeToken;

      const user = await modelUser.getUserById(id);
      if (user.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Get data user by id ${id} not found`,
          null
        );
      }

      if (user[0].image) {
        deleteFile(`public/uploads/user/${user[0].image}`);
      }

      const setData = {
        image: req.file ? req.file.filename : null,
        updatedAt: new Date(Date()),
      };

      const result = await modelUser.updateProfile(setData, id);
      return helperWrapper.response(
        res,
        200,
        "Success update image user",
        result
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

  updatePassword: async (req, res) => {
    try {
      const { id } = req.decodeToken;
      const { newPassword, confirmPassword } = req.body;

      const user = await modelUser.getUserById(id);
      if (user.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Get data user by id ${id} not found`,
          null
        );
      }

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          res,
          400,
          `Password does not match`,
          null
        );
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      const setData = { password: passwordHash };

      const result = await modelUser.updateProfile(setData, id);

      return helperWrapper.response(res, 200, `Success update password`, {
        id: result.id,
      });
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
