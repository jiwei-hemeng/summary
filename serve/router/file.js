import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const __dirname = path.resolve();
    cb(null, path.join(__dirname, "/proxy_public", "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
router.post("/uploadFile", upload.single("file"), (req, res) => {
  res.json({
    status: 200,
    message: "添加成功",
    name: req.body.name,
    url: "/uploads/" + req.file.filename,
  });
});

export default router;
