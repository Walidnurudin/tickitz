const fs = require("fs");

const deleteFile = (filePath) => {
  console.log("Proses delete", filePath);
  // fs.exsistSync // UNTUK MENGECEK FILE
  // fs.unlink // UNTUK MENGHAPUS FILE
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath);
  }
};

module.exports = deleteFile;
