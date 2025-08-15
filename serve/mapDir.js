import path from "path";
import fs from "fs";
for (let filename of fs.readdirSync(path.join())) {
  let res = fs.statSync(filename);
  if (res.isDirectory()) {
    console.log(`${filename} 是一个目录`);
  } else if (res.isFile()) {
    console.log(`${filename} 是一个文件`);
    console.log(res);
  }
}
