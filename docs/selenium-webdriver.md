## NodeJs selenium-webdriver

>  Selenium WebDriver 是一个流行的浏览器自动化工具，可以与 Node.js 结合使用来创建网页测试或爬虫脚本。 

```js
import selenium, { Builder, By, Key, until } from "selenium-webdriver";

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });
}
/**
 * 使用 Selenium WebDriver 进行自动化测试
 * 该脚本打开百度，搜索 "Selenium"，并打印页面标题
 */
async function runTest() {
  // 1. 创建浏览器驱动
  let driver = new selenium.Builder().forBrowser("chrome").build();

  try {
    // 2. 打开网页
    await driver.get("https://www.baidu.com");

    // 3. 找到搜索框并输入内容
    let searchBox = await driver.findElement(By.id("kw"));
    await searchBox.sendKeys("Selenium", Key.RETURN);

    // 4. 等待搜索结果出现
    await driver.wait(until.titleContains("Selenium"), 3000);

    // 5. 获取页面标题
    let title = await driver.getTitle();
    console.log(`当前页面标题: ${title}`);
    await sleep(30); // 等待30秒以便观察结果
  } finally {
    // 6. 关闭浏览器
    await driver.quit();
  }
}

runTest();
```

### 核心组件说明

1. **Builder** - 用于配置和创建 WebDriver 实例
2. **By** - 元素定位策略：
   - `By.id()` - 通过 ID 定位
   - `By.name()` - 通过 name 属性定位
   - `By.css()` - 通过 CSS 选择器定位
   - `By.xpath()` - 通过 XPath 定位
3. **Key** - 键盘特殊按键：
   - `Key.RETURN` - 回车键
   - `Key.TAB` - 制表键
   - `Key.ESCAPE` - ESC 键
4. **until** - 等待条件：
   - `until.titleContains()` - 等待标题包含特定文本
   - `until.elementLocated()` - 等待元素出现

### 点击元素

```js
let btn = await driver.findElement(By.id("btn"));
btn.click()
```

### 处理多窗口/标签页

```js
// 获取所有窗口句柄
let handles = await driver.getAllWindowHandles();
// 切换到第二个窗口
await driver.switchTo().window(handles[1]);
```

### 截图功能

```js
const fs = require('fs');
// 截图并保存
let screenshot = await driver.takeScreenshot();
fs.writeFileSync('screenshot.png', screenshot, 'base64');
```

### 处理下拉菜单

```js
const { Select } = require('selenium-webdriver');
let dropdown = await driver.findElement(By.id('dropdown'));
let select = new Select(dropdown);
await select.selectByVisibleText('选项文本'); // 按显示文本选择
await select.selectByValue('option1'); // 按value值选择
```

## 