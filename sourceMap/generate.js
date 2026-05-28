import { SourceMapGenerator } from "source-map";
import fs from "node:fs";

// 创建 SourceMapGenerator
const generator = new SourceMapGenerator({ file: "bundle.js" });

// 原始源码内容
const sourceCode = `function getUserName(user) {
    return user.name;
}

function processUser() {
    const user = undefined;
    const name = getUserName(user);
    console.log('User name:', name);
}

processUser();`;

// 压缩后的代码
const bundleCode = `function a(b){return b.name}function c(){const d=undefined;const e=a(d);console.log('User name:', e)}c();`;

// 添加映射关系（位置对应）
generator.addMapping({
  generated: { line: 1, column: 0 },
  original: { line: 1, column: 0 },
  source: "../src/App.js",
  name: "getUserName",
});

generator.addMapping({
  generated: { line: 1, column: 15 },
  original: { line: 2, column: 11 },
  source: "../src/App.js",
  name: "user",
});

generator.addMapping({
  generated: { line: 1, column: 22 },
  original: { line: 2, column: 18 },
  source: "../src/App.js",
  name: "name",
});

generator.addMapping({
  generated: { line: 5, column: 0 },
  original: { line: 5, column: 0 },
  source: "../src/App.js",
  name: "processUser",
});

generator.addMapping({
  generated: { line: 5, column: 18 },
  original: { line: 7, column: 16 },
  source: "../src/App.js",
  name: "getUserName",
});

generator.addMapping({
  generated: { line: 9, column: 0 },
  original: { line: 11, column: 0 },
  source: "../src/App.js",
  name: null,
});

// 设置源码内容
generator.setSourceContent("../src/App.js", sourceCode);

// 写入文件
fs.writeFileSync("./bundle.js.map", generator.toString());
fs.writeFileSync(
  "./bundle.js",
  bundleCode + "\n//# sourceMappingURL=bundle.js.map",
);

console.log("✅ Source map 已生成");
