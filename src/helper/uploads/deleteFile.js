const fs = require("fs");

const deleteFile = (filePath) => {
  // fs.exsistSync // UNTUK MENGECEK FILE
  // fs.unlink // UNTUK MENGHAPUS FILE
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) throw new Error("Error delete file");
    });
  }
};

module.exports = deleteFile;
