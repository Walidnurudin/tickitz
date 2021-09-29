const bcrypt = require("bcrypt");
const modelUser = require("./userModel");
const helperWrapper = require("../../helper/wrapper");
const deleteFile = require("../../helper/uploads/deleteFile");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

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
      const user = req.decodeToken;
      const { firstName, lastName, email, phoneNumber } = req.body;

      const setData = {
        firstName,
        lastName,
        email,
        phoneNumber,
      };

      const result = await modelUser.updateProfile(setData, user.id);

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
      const user = req.decodeToken;

      if (user.image) {
        deleteFile(`public/uploads/user/${user.image}`);
      }

      const setData = {
        image: req.file.filename,
      };

      const result = await modelUser.updateProfile(setData, user.id);
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
      const user = req.decodeToken;
      const { newPassword, confirmPassword } = req.body;

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

      const result = await modelUser.updateProfile(setData, user.id);

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
