import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors()); // 允许跨域

// 地图 GeoJSON 代理接口
app.get("/api/map", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).send("id 不能为空");

    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${id}_full.json`;

    // 👇 这是能过 Referer ACL 的唯一正确请求头
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://datav.aliyun.com",
        Origin: "https://datav.aliyun.com",
        Accept: "application/json, text/plain, */*",
        Host: "geo.datav.aliyun.com",
      },
    });

    res.setHeader("Content-Type", "application/json");
    res.send(response.data);
  } catch (err) {
    console.error("代理请求失败：", err.response?.status || err.message);
    res.status(500).json({ error: "获取地图数据失败" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ 代理服务已启动：http://localhost:${PORT}`);
});
