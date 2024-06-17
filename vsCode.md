# 配置

第一步，打开设置，快捷键 *Ctrl + ,*

第二步，打开 `setting.json`

# 丝滑打字配置

```json
{
  "editor.smoothScrolling": true,
  "editor.cursorBlinking": "expand",
  "editor.cursorSmoothCaretAnimation": "on",
  "workbench.list.smoothScrolling": true,
}
```

# 鼠标控制大小

按下 *Ctrl + 鼠标滚轮* 可调节大小

```js
{
  "editor.mouseWheelZoom": true,
}
```

# 彩虹括号与作用域块线条提示

```json
{
  "editor.guides.bracketPairs": true,
  "editor.bracketPairColorization.enabled": true,
}
```

# 更加智能的代码提示

```json
{
  // 控制活动代码段是否阻止快速建议
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  // 除了 `Tab` 键以外， `Enter` 键是否同样可以接受建议
  // 这能减少“插入新行”和“接受建议”命令之间的歧义
  "editor.acceptSuggestionOnEnter": "smart",
  // 代码补全列表中，优先选择最近的建议
  "editor.suggestSelection": "recentlyUsedByPrefix",
}
```

这个也是可以配置的

```json
{
  "editor.suggest.insertMode": "replace",
}
```

# 自动补全括号、引号

```json
{
  "editor.autoClosingBrackets": "beforeWhitespace",
  "editor.autoClosingDelete": "always",
  "editor.autoClosingOvertype": "always",
  "editor.autoClosingQuotes": "beforeWhitespace",
}
```

# 关闭缩进猜测

```json
{
  // 关闭缩进猜测
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
}
```

# 美化窗口

```json
{
  "window.dialogStyle": "custom",
}
```

# Typescript 语言设置中文

```json
{
  "typescript.locale": "zh-CN",
}
```

# 生成的html模板中的语言改为中文

```json
{
  "emmet.variables": {"lang": "zh-CN"}
}
```

# 保存自动删除末尾空格

```json
{
  "files.trimTrailingWhitespace": false,
}
```

# 搜索排除目录

```json
{
  "search.exclude": {
    "**/node_modules": true,
    "**/pnpm-lock.yaml": true,
    "**/package-lock.json": true,
    "**/.DS_Store": true,
    "**/.git": true,
    "**/.gitignore": true,
    "**/.idea": true,
    "**/.svn": true,
    "**/.vscode": true,
    "**/build": true,
    "**/dist": true,
    "**/tmp": true,
    "**/yarn.lock": true
  },
}
```

# **window 相对路径复制使用** `/`

```json
{
  "explorer.copyRelativePathSeparator": "/",
}
```

# 关闭自动更新

```json
{
  "update.mode": "manual",
}
```

# 父级自动吸附置顶

```json
{
  "editor.stickyScroll.enabled": true,
}
```

# 终端相关配置

```json
{
  // 终端代码补全
  "terminal.integrated.shellIntegration.suggestEnabled": true,
  // 终端命令置顶
  "terminal.integrated.stickyScroll.enabled": true
}
```

