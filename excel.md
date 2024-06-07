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

