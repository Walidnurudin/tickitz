const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../../helper/email");
const helperWrapper = require("../../helper/wrapper");
const modelAuth = require("./authModel");
const redis = require("../../config/redis");
require("dotenv").config();

module.exports = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, role, password } = req.body;
      // PROSES PENGECEKAN EMAIL SUDAH PERNAH TERDAFTAR ATAU BELUM DI DATABASE
      const checkUser = await modelAuth.getUserByEmail(email);

      if (checkUser.length > 0) {
        return helperWrapper.response(res, 409, `Email already used`, null);
      }

      // ENCRYPT PASSWORD
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const setData = {
        id: uuidv4(),
        firstName,
        lastName,
        email,
        role: role || "USER",
        password: passwordHash,
      };

      const result = await modelAuth.register(setData);

      const sendDataEmail = {
        to: result.email,
        subject: "Email Verification !",
        template: "email-verification",
        data: {
          firstName: result.firstName,
          id: result.id,
        },
        // attachment: [
        //   {
        //     filename: "movie1.jpg",
        //     path: "./public/uploads/movie/2021-09-29T06-59-56.645ZAstronaut.jpeg",
        //   },
        // ],
      };

      await sendMail(sendDataEmail);

      return helperWrapper.response(res, 200, `Success register user`, result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await modelAuth.getUserByEmail(email);

      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, `Email not registed`, null);
      }

      // COMPARE PASSWORD return boolean
      const isMatch = await bcrypt.compare(password, checkUser[0].password);

      if (!isMatch) {
        return helperWrapper.response(res, 404, `Wrong password`, null);
      }

      // Check status user
      if (checkUser[0].status !== "Active") {
        return helperWrapper.response(
          res,
          400,
          `Please activate email first`,
          null
        );
      }

      // MEMBUAT TOKEN MENGGUNAKAN JWT (data yang mau diubah, key/kata kunci, expaired/lama token bisa digunakan)
      const payload = checkUser[0];
      delete payload.password;
      const token = jwt.sign({ ...payload }, process.env.SECRET_KEY, {
        expiresIn: "24h",
      });

      return helperWrapper.response(res, 200, "Success login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },

  activate: async (req, res) => {
    try {
      const { id } = req.params;

      await modelAuth.activate("Active", id);
      return helperWrapper.response(res, 200, "Success activate email");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },

  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      redis.setex(`accessToken:${token}`, 3600 * 24, token);
      return helperWrapper.response(res, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
};
