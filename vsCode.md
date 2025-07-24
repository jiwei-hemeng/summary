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

# 定制主题

```json
{
  // 自定义代码颜色
  "editor.semanticHighlighting.enabled": true,
  "editor.tokenColorCustomizations": {
    "keywords": "#c678dd",
    "variables": "#e06c75",
    "functions": "#61afef",
    "strings": "#98c379",
    "numbers": "#d19a66",
    "[Default Dark Modern]": {
      "keywords": "#c678dd",
      "numbers": "#d19a66",
      "functions": "#61afef",
      "comments": "#ffc3bab7",
      "strings": "#98c379",
      "variables": "#e06c75"
    },
    "[Visual Studio Dark]": {
      "keywords": "#c678dd",
      "numbers": "#d19a66",
      "functions": "#61afef",
      "comments": "#ffc3bab7",
      "strings": "#98c379",
      "variables": "#e06c75"
    },
    "comments": {
      "fontStyle": "italic",
      "foreground": "#c3bfbf8d"
    },
    "textMateRules": [
      {
        "scope": [
          "storage", // function const let
          "variable.parameter",
          "keyword.control"
        ],
        "settings": {
          "fontStyle": "italic"
        }
      },
      {
        "scope": "keyword.operator.new",
        "settings": {
          "fontStyle": "italic",
          "foreground": "#c678dd"
        }
      },
      {
        // 算数符号
        "scope": ["keyword.operator", "keyword.operator.assignment"],
        "settings": {
          "foreground": "#56b6c2"
        }
      },
      // HTML
      {
        "scope": [
          "punctuation.definition.tag.begin.html",
          "punctuation.definition.tag.end.html"
        ],
        "settings": {
          "foreground": "#abb2bf"
        }
      },
      {
        "scope": "entity.name.tag",
        "settings": {
          "foreground": "#e06c75"
        }
      },
      {
        "scope": "entity.other.attribute-name",
        "settings": {
          "foreground": "#c59a66",
          "fontStyle": "italic"
        }
      },
      {
        "scope": ["meta.property-name", "support.type.property-name"],
        "settings": {
          "foreground": "#e06c75"
        }
      },
      {
        "scope": [
          "meta.property-value",
          "meta.property-value constant.other",
          "support.constant.property-value"
        ],
        "settings": {
          "foreground": "#ce9178"
        }
      },
      {
        // JSON key
        "scope": ["support.type.property-name"],
        "settings": {
          "foreground": "#e06c75"
        }
      },
      // Markdown
      {
        "scope": "markup.bold",
        "settings": {
          "foreground": "#c678dd",
          "fontStyle": "bold underline"
        }
      },
      {
        "scope": "markup.italic",
        "settings": {
          "foreground": "#e5c07b"
        }
      },
      {
        "scope": "markup.heading",
        "settings": {
          "foreground": "#e06c75"
        }
      },
      {
        // link 的文字部分
        "scope": "string.other.link.title.markdown",
        "settings": {
          "foreground": "#7DE0DA"
        }
      },
      {
        "scope": "markup.underline.link.markdown",
        "settings": {
          "foreground": "#98c379"
        }
      },
      {
        // 无序列表
        "scope": "markup.list.unnumbered",
        "settings": {
          "foreground": "#41d9ea"
        }
      },
      {
        // 引用块颜色，如： > Test
        "scope": "markup.quote",
        "settings": {
          "foreground": "#989c99",
          "fontStyle": "bold"
        }
      }
    ]
  },
  "editor.semanticTokenColorCustomizations": {
    "enabled": true,
    "rules": {
      "property": "#e06c75",
      "function": "#61afef",
      "*.async": "#eea667",
      "method": "#61afef",
      "*.readonly": "#e5c07b",
      "enumMember": "#e5c07b",
      "parameter": "#e06c75",
      "class": "#e5c07b",
      "attribute": "#e06c75",
      "*.documentation": "#e5c07b",
      "*.deprecated": "#ff4500",
      "*.modification": "#ff4500",
      "*.abstract": "#c678dd"
    }
  },
  "workbench.colorCustomizations": {
    // 修改选择相同代码后的颜色
    "editor.wordHighlightBackground": "#3be2f806",
    "editor.selectionHighlightBackground": "#c865f942",
    // 当前选项卡背景颜色
    "tab.activeBackground": "#193d4c",
    // 括号颜色
    "editorBracketMatch.background": "#565d6a",
    "editorBracketMatch.border": "#0077ffa6",
    // 背景色
    "editor.background": "#191815d6",
    // 侧栏颜色
    "activityBar.activeBackground": "#193d4c",
    "activityBar.background": "#191815d6",
    "activityBar.foreground": "#fff",
    // 光标所在行的背景色
    "editor.lineHighlightBackground": "#23262cbb",
    // 光标所在行的边框色
    "editor.lineHighlightBorder": "#23262cbb",
    "terminalStickyScroll.background": "#18181893"
  }
}
```

# files.watcherExclude

> 排除对node_modules的文件监听，减少内存的使用

```json
{
  "files.watcherExclude": {
    "**/node_modules/*/**": true,
    "**/dist/*/**": true,
    "**/.git/**": true,
  },
}
```

# 配置路径别名，方便ctrl跳转

在项目的根目录上创建文件`jsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "allowSyntheticDefaultImports": false,
    "baseUrl": "./",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  },
  "exclude": [
    "node_modules",
    "dist"
  ],
  "include": [
    "src/**/*"
  ]
}
```

# vscode 常用插件

+ Chinese (Simplified) (简体中文) - 汉化插件
+ ESLint - js代码语法校验
+ Prettier - Code formatter - 代码格式化插件
+ Live Server - 本地代码服务器
+ open-in-browser - 右键通过浏览器打开网页文件
+ gitlens - git 历史提交记录
+ Vue - Official - vue3 的语法扩展程序
+ Postcode - 类似于postman的插件
+ Draw.io Integration

# npm 脚本使用yarn 打包

```json
{
  "npm.scriptRunner": "yarn",
}
```
