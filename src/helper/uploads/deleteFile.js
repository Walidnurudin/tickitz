const fs = require("fs");

// promise, reject() => catch()

const deleteFile = (filePath) =>
  new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) reject(new Error("Error delete file"));
        resolve();
      });
    }
  });

module.exports = deleteFile;
