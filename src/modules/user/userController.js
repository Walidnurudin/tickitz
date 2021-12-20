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

      if (!firstName || !lastName || !email || !phoneNumber) {
        return helperWrapper.response(
          res,
          400,
          `Please complete all fields`,
          null
        );
      }

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

      if (!newPassword || !confirmPassword) {
        return helperWrapper.response(
          res,
          400,
          `Please complete all fields`,
          null
        );
      }

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

  getTicketHistory: async (req, res) => {
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

      const result = await modelUser.ticketHistory(id);
      if (!result) {
        return helperWrapper.response(
          res,
          404,
          `Ticket history by id ${id} not found`,
          null
        );
      }

      const newResult = [];
      result.forEach((item) => {
        const existing = newResult.filter(
          (item2) => item2.scheduleId === item.scheduleId
        );
        if (existing.length) {
          const existingIndex = newResult.indexOf(existing[0]);
          newResult[existingIndex].seat = newResult[existingIndex].seat.concat(
            item.seat
          );
        } else {
          // eslint-disable-next-line no-param-reassign
          if (typeof item.seat === "string") item.seat = [item.seat];
          newResult.push(item);
        }
      });

      return helperWrapper.response(
        res,
        200,
        `Success get ticket history`,
        newResult
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
};
