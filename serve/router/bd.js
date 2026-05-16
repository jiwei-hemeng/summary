// @ts-nocheck
import express from "express";
import db from "../utils/db.js";
const router = express.Router();
router.get("/getFullColumns", async (req, res) => {
  try {
    const { tableName } = req.query;
    const sql = `show full columns from ${tableName}`;
    const result = await db(sql);
    res.json({
      code: 200,
      message: "操作成功",
      data: result,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/getTableList", async (req, res) => {
  try {
    const { tableName, _page, _limit = 20, ...columns } = req.query;
    let where = null;
    let queryArr = Object.keys(columns).map((item) => {
      return item + "='" + columns[item] + "'";
    });
    where = queryArr.join(" and ");

    let sql = null;
    let sql2 = null;
    if (queryArr.length) {
      sql = `SELECT * FROM ${tableName} where `;
      sql2 = `select count(*) from ${tableName} where `;
      sql += where;
      sql2 += where;
    } else {
      sql = `SELECT * FROM ${tableName}`;
      sql2 = `select count(*) from ${tableName}`;
    }
    // 如果有_page参数就分页，_limit 默认20
    let total = null;
    if (_page) {
      let start = (Number(_page) - 1) * Number(_limit);
      const [ct] = await db(sql2);
      total = ct["count(*)"];
      sql += " limit " + start + "," + _limit;
    }

    const result = await db(sql);
    res.json({
      code: 200,
      message: "操作成功",
      data: _page ? { total, list: result } : result,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
