const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../../config/nodemailer");
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

      const mailOptions = {
        from: "walidnurudin47@gmail.com",
        to: result.email,
        subject: "Tickitz application",
        html: `<h1>Activate email <a href='http://localhost:3001/auth/activate/${result.id}'>here</a></h1>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) throw err;
        // console.log(`Email sent: ${info.response}`);
      });

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
