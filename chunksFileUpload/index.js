const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

app.get("/html/:htmlFile", (req, res) => {
  res.sendFile(path.join(__dirname, `./${req.params.htmlFile}`));
});
// 配置Multer存储
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
function mergeChunks(fileName, totalChunks) {
  const mergedFilePath = path.join("uploads", fileName);
  const writeStream = fs.createWriteStream(mergedFilePath);
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join("uploads", `${fileName}.part${i}`);
    const chunk = fs.readFileSync(chunkPath);
    writeStream.write(chunk);
    fs.unlinkSync(chunkPath); // 删除分块文件
  }
  writeStream.end();
  console.log(`File ${fileName} merged successfully`);
}
app.post("/upload", upload.single("file"), (req, res) => {
  const { chunkIndex, totalChunks, fileName } = req.body;
  const chunkPath = path.join("uploads", `${fileName}.part${chunkIndex}`);
  console.log(
    `Received chunk ${chunkIndex} of ${totalChunks}, chunkPath is ${chunkPath}`
  );
  fs.rename(req.file.path, chunkPath, (err) => {
    if (err) {
      return res.status(500).send("Error saving chunk");
    }
    if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
      // 所有分块上传完成，合并文件
      mergeChunks(fileName, totalChunks);
    }
    const progress = (chunkIndex / totalChunks) * 100;
    res.json({
      code: "200",
      message: "Chunk uploaded successfully",
      progress: progress.toFixed(2) + "%",
    });
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
