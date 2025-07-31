# 下载excel

可以通过 npm 或者直接下载源码的方式来获取 `xlsx.js` 库

```shell
npm install xlsx
```

或者从 CDN 加载

```html
<script src="https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

# 读取excel 数据

```js
import XLSX from "xlsx";
const fileReader = new FileReader();
fileReader.readAsBinaryString(blobData);
fileReader.onload = (event) => {
  try {
    const { result } = event.target;
    // 以二进制流方式读取得到整份excel表格对象
    const workbook = XLSX.read(result, { type: "binary" });
    let data = {}; // 存储获取到的数据
    // 遍历每张工作表进行读取（这里默认只读取第一张表）
    for (const sheet in workbook.Sheets) {
      if (
        Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)
      ) {
        data[sheet] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      }
    }
    console.log(data);
  } catch (e) {
    // 这里可以抛出文件类型错误不正确的相关提示
    console.log("文件类型不正确");
    return;
  }
};
```

# 写入数据

```js
import XLSX from "xlsx";
// 写入文件
const sheetData = [
  ["Name", "Age"],
  ["Alice", 20],
  ["Bob", 25],
];
const sheet2Data = [
  ["Name1", "Age2"],
  ["Alice", 20],
  ["Bob", 25],
];
const ws = XLSX.utils.aoa_to_sheet(sheetData); // 创建工作表
const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
const wb = XLSX.utils.book_new(); // 创建工作簿
XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // 将工作表添加到工作簿
XLSX.utils.book_append_sheet(wb, ws2, "Sheet2");
XLSX.writeFile(wb, "output.xlsx"); // 导出文件
```

# XLSX.utils 下的 Api 

## 工作表

- aoa_to_sheet 将 JS 数据数组转换为工作表
- json_to_sheet 将 JS 对象数组转换为工作表
- table_to_sheet 将 DOM 表元素转换为工作表
- sheet_add_aoa 将 JS 数据数组添加到现有工作表中
- sheet_add_json 将 JS 对象数组添加到现有工作表中
- sheet_add_dom 将 DOM 表元素中的数据添加到现有工作表中
- sheet_to_json 将工作表转换为 JSON 对象数组
- sheet_to_cvs 生成分隔符分隔的值输出
- sheet_to_txt 生成 UTF16 格式的文本
- sheet_to_html 生成 HTML 输出
- sheet_to_formulae 生成公式列表（具有值回退）

## 工作簿

- book_new 创建工作簿
- book_append_sheet 将工作表添加到工作簿

# json_to_sheet

```js
const tableData = [
  { department: "行政部", count: 2 },
  { department: "技术部", count: 2 },
];
const ws = XLSX.utils.json_to_sheet(tableData);
const wb = XLSX.utils.book_new(); // 创建工作簿
XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // 将工作表添加到工作簿
XLSX.writeFile(wb, "output.xlsx");
```

# table_to_sheet

```js
const workbook = XLSX.utils.book_new();
const ws = XLSX.utils.table_to_sheet(
  document.querySelector("#resultTable"),
  {
    raw: true,
  }
);
XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");
XLSX.writeFile(workbook, `output${Date.now()}.xlsx`);
```

# exceljs

## 封装函数

```js
import ExcelJS from "exceljs";

function downloadFile(url, filename) {
  const alink = document.createElement("a");
  alink.setAttribute("href", url);
  alink.setAttribute("download", filename);
  document.body.appendChild(alink);
  alink.click();
  document.body.removeChild(alink);
}

/**
 * 从columns数组中获取列名和列宽
 *
 * @param arr 包含列信息的数组
 * @returns 包含列名和列宽的对象
 */
function getColumnsKeys(columns) {
  const columnsKeys = [];
  const columnsWidths = [];
  for (let item of columns) {
    if (item.children) {
      for (let it of item.children) {
        columnsKeys.push(it.key);
        columnsWidths.push({ width: it.width / 8 });
      }
    } else {
      columnsKeys.push(item.key);
      columnsWidths.push({ width: item.width / 8 });
    }
  }
  return { columnsKeys, columnsWidths };
}

/**
 * 导出带有增强表头的Excel文件
 *
 * @param columns 表头配置
 * @param data 需要展示的数据数组
 * @param mergeCells 合计一行需要合并的单元格，例如：[{start: { row: 2, column: 1 }, end: { row: 2, column: 5 }}]
 */
export async function exportExcelWithEnhancedHeader(
  columns, // 表头
  data, //展示的数组
  mergeCells // 合计一行需要合并的单元格
) {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加sheet标签页
  const worksheet = workbook.addWorksheet("信息汇总");
  const { columnsKeys, columnsWidths } = getColumnsKeys(columns);
  // 生成表头行（只需要一行）
  const headerRow = [];
  const merges = [];
  let currentCol = 1;

  columns.forEach((item) => {
    if (item.children) {
      // 处理有子项的组
      const startCol = currentCol;

      // 添加子项
      item.children.forEach((child) => {
        headerRow.push(child.title);
        currentCol++;
      });

      // 在当前行合并父标题
      merges.push({
        start: { row: 1, column: startCol },
        end: { row: 1, column: startCol + item.children.length - 1 },
      });

      // 在当前行添加父标题（会覆盖第一个子项）
      worksheet.getCell(1, startCol).value = item.title;
    } else {
      // 处理普通表头项
      merges.push({
        start: { row: 2, column: currentCol },
        end: { row: 1, column: currentCol },
      });
      worksheet.getCell(1, currentCol).value = item.title;
      headerRow.push(item.title);
      currentCol++;
    }
  });

  // 添加表头行到工作表
  worksheet.addRow(headerRow);
  worksheet.getRow(1).height = 25;
  worksheet.getRow(2).height = 25;
  // 合并单元格（只在当前行合并）
  merges.forEach((merge) => {
    worksheet.mergeCells(
      merge.start.row,
      merge.start.column,
      merge.end.row,
      merge.end.column
    );
  });

  // 设置表头样式
  const headerStyle = {
    fill: {
      type: "pattern",
      pattern: "solid",
      // fgColor: { argb: "FF4F81BD" },
      fgColor: { argb: "00eaeaed" },
    },
    font: {
      bold: true,
      color: { argb: "00000000" },
    },
    border: {
      top: { style: "thin", color: { argb: "ffaaaaaa" } },
      left: { style: "thin", color: { argb: "ffaaaaaa" } },
      bottom: { style: "thin", color: { argb: "ffaaaaaa" } },
      right: { style: "thin", color: { argb: "ffaaaaaa" } },
    },
    alignment: {
      vertical: "middle",
      horizontal: "center",
    },
  };

  // 应用样式到整个表头行
  for (let col = 1; col <= headerRow.length; col++) {
    const cell = worksheet.getCell(1, col);
    const cell2 = worksheet.getCell(2, col);
    Object.assign(cell, headerStyle);
    Object.assign(cell2, headerStyle);
  }

  // 添加数据行
  data.forEach((item) => {
    const rowData = columnsKeys.map((it) => item[it] ?? "");
    const row = worksheet.addRow(rowData);
    row.height = 25;
    // 设置数据行样式
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "ffaaaaaa" } },
        left: { style: "thin", color: { argb: "ffaaaaaa" } },
        bottom: { style: "thin", color: { argb: "ffaaaaaa" } },
        right: { style: "thin", color: { argb: "ffaaaaaa" } },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });
  for (let j of mergeCells) {
    worksheet.mergeCells(j.start.row, j.start.column, j.end.row, j.end.column);
  }

  // 设置列宽
  worksheet.columns = columnsWidths;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  downloadFile(window.URL.createObjectURL(blob), "职业健康_信息汇总.xlsx");
}
```
