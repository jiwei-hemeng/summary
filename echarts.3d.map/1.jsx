import React from "react";
import { Table } from "antd";

const data = [
  { key: "1", name: "张三", age: 28, address: "北京", department: "研发部" },
  { key: "2", name: "张三", age: 28, address: "上海", department: "研发部" },
  { key: "3", name: "李四", age: 32, address: "广州", department: "市场部" },
  { key: "4", name: "王五", age: 32, address: "深圳", department: "市场部" },
  { key: "5", name: "王五", age: 32, address: "杭州", department: "市场部" },
];

function precomputeSpans(data, field) {
  const spans = new Array(data.length).fill(1);

  for (let i = 1; i < data.length; i++) {
    if (data[i][field] === data[i - 1][field]) {
      spans[i] = 0;
      spans[i - spans[i - 1]] += 1;
    }
  }

  return spans;
}

const nameSpans = precomputeSpans(data, "name");
// [2,0,1,2,0]
const deptSpans = precomputeSpans(data, "department");

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    render: (text, record, index) => ({
      children: text,
      props: { rowSpan: nameSpans[index] },
    }),
  },
  {
    title: "年龄",
    dataIndex: "age",
  },
  {
    title: "地址",
    dataIndex: "address",
  },
  {
    title: "部门",
    dataIndex: "department",
    render: (text, record, index) => ({
      children: text,
      props: { rowSpan: deptSpans[index] },
    }),
  },
];

function MergedTable() {
  return (
    <Table columns={columns} dataSource={data} bordered pagination={false} />
  );
}

export default MergedTable;
