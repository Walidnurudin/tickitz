const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ticketing",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log("You are now connected db mysql...");
});

module.exports = connection;
