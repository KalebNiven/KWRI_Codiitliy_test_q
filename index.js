const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(".");
const convertDate = (inputFormat) => {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getUTCDate()), pad(d.getMonth() + 1), d.getFullYear()].join(
    "-"
  );
};
const getRelativePath = (filepath) => {
  return filepath.replace(ROOT, "");
};

const readFileMetaData = (stats, fileName, filePath) => {
  return {
    fileName: path.basename(fileName),
    filePath: getRelativePath(filePath),
    size: stats.size,
    createdAt: convertDate(stats.ctime),
    isDirectory: fs.statSync(filePath).isDirectory(),
  };
};

const main = (filePath) => {
  return new Promise((resolve, reject) => {
    // does not exist
    if (!fs.existsSync(filePath)) {
      return reject({ message: "Invalid Path" });
    }

    const resultArray = [];
    // exists and is a directory
    const isDirectory = fs.statSync(filePath).isDirectory();
    if (isDirectory) {
      const files = fs.readdirSync(filePath);
      // Getting information for a directory
      for (let i = 0; i < files.length; i++) {
        resultArray.push(
          readFileMetaData(
            fs.statSync(filePath),
            files[i],
            filePath + "/" + files[i]
          )
        );
      }
      return resolve(resultArray);
    }

    // exists and is a file
    resultArray.push(
      readFileMetaData(fs.statSync(filePath), filePath, filePath)
    );
    return resolve(resultArray);
  });
};

// main(ROOT + "/tmp").then((res) => console.log("res", res));
// main(ROOT + "/tmp/file.txt").then((res) => console.log("res", res));
main(ROOT + "/tmp/test_dir").then((res) => console.log("res", res));
module.exports = main;
