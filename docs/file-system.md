# 文档对象

## 基本使用

```js
// 选择文件
await window.showOpenFilePicker();
// 选择文件夹
await window.showDirectoryPicker();
```

## 获取文件句柄

```js
const [fileHandle] = await window.showOpenFilePicker({
  types: [
    {
      description: "Images",
      accept: {
        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      },
    },
    {
      description: "Excel Files",
      accept: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "application/vnd.ms-excel": [".xls"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
});
```

## 获取文件内容

```js
const fileHandle = await window.showOpenFilePicker();
const file = await fileHandle.getFile();
const text = await file.text(); // 读取为文本
const buffer = await file.arrayBuffer(); // ArrayBuffer
const stream = file.stream(); // ReadableStream
```

## 写入文件

```js
// 先通过 showSaveFilePicker 获取可写入的文件句柄
const writableHandle = await window.showSaveFilePicker({
  suggestedName: "new-file.txt",
  types: [{ accept: { "text/plain": [".txt"] } }],
});

// 写入内容
const writable = await writableHandle.createWritable();
await writable.write("Hello, File System Access API!");
await writable.close();
```

## 判断是文件夹还是文件

```js
const fileHandle = await window.showOpenFilePicker();
fileHandle.kind;
```

## 获取文件夹下面的文件

```js
const fileHandle = await window.showDirectoryPicker();
for await (const entry of fileHandle.values()) {
  if (entry.kind === "file") {
    console.log("entry", await entry.getFile());
  }
}
```

## 如何优雅降级

```js
async function selectFile() {
  const { promise, resolve, reject } = Promise.withResolvers();
  if (window.showOpenFilePicker) {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    resolve(file);
  } else {
    const inputFile = document.createElement("input");
    inputFile.setAttribute("type", "file");
    inputFile.addEventListener("change", (e) => {
      resolve(e.target.files[0]); // 修正这里
    });
    inputFile.click();
  }
  return promise;
}
```
