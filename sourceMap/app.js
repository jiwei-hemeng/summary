import { SourceMapConsumer } from "source-map";
import fs from "node:fs";

async function resolveStack(mapPath, stack) {
  console.log("=== Source Map 反查工具 ===\n");

  // 读取 source map 文件
  const mapContent = fs.readFileSync(mapPath, "utf8");
  const consumer = await new SourceMapConsumer(JSON.parse(mapContent));

  // 解析堆栈中的每一行
  const lines = stack.split("\n");
  const results = [];

  for (const line of lines) {
    // 匹配格式: at 函数名 (文件名.js:行号:列号)
    const match = line.match(/\(?([^/\s()]+\.js):(\d+):(\d+)\)?/);
    if (match) {
      const filename = match[1];
      const genLine = parseInt(match[2]);
      const genColumn = parseInt(match[3]);

      console.log(`📦 压缩代码: ${filename}:${genLine}:${genColumn}`);

      // 反查原始位置
      const original = consumer.originalPositionFor({
        line: genLine,
        column: genColumn,
      });

      if (original.source !== null) {
        // 清理路径
        const cleanSource = original.source.replace(/^\.\.\//, "");

        // 获取源码内容
        const sourceContent = consumer.sourceContentFor(original.source);

        console.log(
          `   ✅ 原始位置: ${cleanSource}:${original.line}:${original.column}`,
        );
        if (original.name) {
          console.log(`   📛 函数名: ${original.name}`);
        }

        // 显示具体代码行
        if (sourceContent) {
          const lines = sourceContent.split("\n");
          if (lines[original.line - 1]) {
            const codeLine = lines[original.line - 1];
            console.log(`   📝 代码: ${codeLine.trim()}`);
            console.log(
              `   ⬇️  指向: ${" ".repeat(Math.max(0, original.column - 1))}^`,
            );
          }
        }

        results.push({
          originalFile: cleanSource,
          line: original.line,
          column: original.column,
          name: original.name,
        });
      } else {
        console.log(`   ❌ 无法映射到源码`);
      }
      console.log("");
    }
  }

  consumer.destroy();

  if (results.length === 0) {
    console.log("⚠️  没有找到可映射的堆栈信息");
  }

  return results;
}

// 使用示例
const stackTrace = `
Error: Cannot read property 'name' of undefined
    at getUserName (bundle.js:1:15)
    at processUser (bundle.js:5:18)
    at c (bundle.js:9:1)

`;

resolveStack("./bundle.js.map", stackTrace)
  .then((results) => {
    console.log("=== 反查结果汇总 ===");
    results.forEach((r, i) => {
      console.log(
        `${i + 1}. ${r.originalFile}:${r.line}:${r.column}${r.name ? ` (${r.name})` : ""}`,
      );
    });
  })
  .catch(console.error);
