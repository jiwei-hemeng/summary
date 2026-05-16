import { Table } from "antd";
import React, { useMemo } from "react";

const data = [
  { key: "1", department: "技术部", name: "张三", age: 28 },
  { key: "2", department: "技术部", name: "张三", age: 28 },
  { key: "3", department: "技术部", name: "李四", age: 32 },
  { key: "4", department: "市场部", name: "王五", age: 25 },
  { key: "5", department: "市场部", name: "赵六", age: 30 },
];

const DemoTable = () => {
  // 预计算合并信息
  const processedData = useMemo(() => {
    return data.map((item, index, arr) => ({
      ...item,
      _departmentSpan: calculateSpan(index, arr, "department"),
      _nameSpan: calculateSpan(index, arr, "name"),
    }));
  }, [data]);

  function calculateSpan(currentIndex, array, field) {
    if (
      currentIndex > 0 &&
      array[currentIndex][field] === array[currentIndex - 1][field]
    ) {
      return 0;
    }

    let span = 1;
    for (let i = currentIndex + 1; i < array.length; i++) {
      if (array[i][field] === array[currentIndex][field]) {
        span++;
      } else {
        break;
      }
    }
    return span;
  }

  const columns = useMemo(
    () => [
      {
        title: "部门",
        dataIndex: "department",
        onCell: (_, index) => ({
          rowSpan: processedData[index]._departmentSpan,
        }),
      },
      {
        title: "姓名",
        dataIndex: "name",
        onCell: (_, index) => ({
          rowSpan: processedData[index]._nameSpan,
        }),
      },
      {
        title: "年龄",
        dataIndex: "age",
      },
    ],
    [processedData]
  );

  return <Table columns={columns} dataSource={processedData} bordered />;
};

export default DemoTable;
