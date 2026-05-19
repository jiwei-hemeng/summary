# lint-staged + husky 项目使用完整教程

## 安装依赖

```shell
pnpm add husky lint-staged eslint  prettier -D
```

## 启用 Git 钩子

在 package.json 中添加脚本

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

执行初始化

```shell
pnpm prepare
```

执行后会生成 .husky 目录

添加 pre-commit 钩子

```shell
pnpx husky add .husky/pre-commit "npx lint-staged"
```

打开 .husky/pre-commit 文件，内容如下即成功：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

## 配置 lint-staged

在 package.json 中添加脚本

```json
{
  "lint-staged": {
    // 对 JS/TS 文件执行 eslint 校验 + prettier 格式化
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    // 对样式文件执行 prettier 格式化
    "*.{vue,html,css,scss,less}": [
      "prettier --write"
    ]
  }
}
```

## 测试是否生效

```shell
git add .
git commit -m "测试提交"
```

✅ 生效表现：
+ 自动格式化暂存区代码
+ 有 ESLint 错误会阻止提交，修复后才能提交

跳过校验（不推荐）

```shell
git commit -m "xxx" --no-verify
```
