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

