import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = express.Router();
const __dirname = path.resolve();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/proxy_public", "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
function mergeChunks(fileName, totalChunks) {
  const mergedFilePath = path.join(
    __dirname,
    "proxy_public",
    "uploads",
    fileName
  );
  const writeStream = fs.createWriteStream(mergedFilePath);
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(
      __dirname,
      "proxy_public",
      "uploads",
      `${fileName}.part${i}`
    );
    console.log(`Merging chunk ${i} from ${chunkPath}`);
    const chunk = fs.readFileSync(chunkPath);
    writeStream.write(chunk);
    fs.unlinkSync(chunkPath); // 删除分块文件
  }
  writeStream.end();
}
const upload2 = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "/proxy_public", "/uploads"),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
router.post("/uploadFile", upload.single("file"), (req, res) => {
  res.json({
    status: 200,
    message: "添加成功",
    name: req.body.name,
    url: "/uploads/" + req.file.filename,
  });
});
/**
 * 分片上传文件接口
 */
router.post("/uploadSliceFile", upload2.single("file"), (req, res) => {
  const { chunkIndex, totalChunks, fileName } = req.body;
  const chunkPath = path.join(
    __dirname,
    "/proxy_public",
    "uploads",
    `${fileName}.part${chunkIndex}`
  );
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

export default router;
