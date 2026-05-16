// @ts-nocheck
import React, { useRef, useEffect } from "react";
import indexdbHelper from "@/utils/Indexdb.js";
export default function Indexdb() {
  async function getData() {
    const routers = await indexdbHelper.readAll("routers");
    console.log("routers", routers);
  }
  async function addData() {
    await indexdbHelper.save(
      {
        // id: Date.now(),
        name: "name" + parseInt(Math.random() * 100),
        path: "path" + parseInt(Math.random() * 100),
        moduleType: Math.round(Math.random())
      },
      "routers"
    );
  }
  return (
    <div>
      <button onClick={addData}>添加数据</button>
      <button onClick={getData}>查询数据</button>
    </div>
  );
}
