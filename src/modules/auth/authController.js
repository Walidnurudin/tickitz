const helperWrapper = require("../../helper/wrapper");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      // PROSES PENGECEKAN EMAIL SUDAH PERNAH TERDAFTAR ATAU BELUM DI DATABASE

      // ENCRYPT PASSWORD

      const setData = {
        id,
        email,
        password,
      };

      console.log(req.body);
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
      console.log(req.body);
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
