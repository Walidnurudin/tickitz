const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hai");
});

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running in port ${3001}`);
});
