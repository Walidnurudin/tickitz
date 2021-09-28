const bcrypt = require("bcrypt");
const modelUser = require("./userModel");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, phoneNumber } = req.body;

      const checkUser = await modelUser.getUserById(id);

      if (checkUser.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `User by id ${id} not found`,
          null
        );
      }

      const setData = {
        firstName,
        lastName,
        email,
        phoneNumber,
      };

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

  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword, confirmPassword } = req.body;

      const checkUser = await modelUser.getUserById(id);

      if (checkUser.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `User by id ${id} not found`,
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
