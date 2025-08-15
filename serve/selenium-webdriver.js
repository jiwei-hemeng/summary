import { Builder, By, until, Key } from "selenium-webdriver";
class TicketGrabber {
  constructor() {
    this.driver = null;
  }

  async initBrowser() {
    // 创建 WebDriver 实例
    this.driver = await new Builder().forBrowser("chrome").build();
    // 设置隐式等待时间
    await this.driver.manage().setTimeouts({ implicit: 10000 });
  }

  sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time * 1000);
    });
  }

  async login(username, password) {
    try {
      // 打开登录页面
      await this.driver.get("https://kyfw.12306.cn/otn/resources/login.html");

      // 切换到账号登录
      const accountLogin = await this.driver.wait(
        until.elementLocated(By.className("login-hd-code")),
        10000
      );
      await accountLogin.click();

      // 输入用户名和密码
      const usernameInput = await this.driver.wait(
        until.elementLocated(By.id("J-userName")),
        10000
      );
      const passwordInput = await this.driver.findElement(By.id("J-password"));

      await usernameInput.sendKeys(username);
      await passwordInput.sendKeys(password);

      // 点击登录按钮
      const loginBtn = await this.driver.wait(
        until.elementLocated(By.id("J-login")),
        10000
      );
      await loginBtn.click();

      console.log("请手动完成滑块验证（如果有）...");
      await this.sleep(60); // 等待10秒，用户可以手动完成滑块验证

      console.log("登录成功");
      return true;
    } catch (error) {
      console.error("登录失败:", error);
      return false;
    }
  }

  async searchTicket(fromStation, toStation, date) {
    try {
      // 进入购票页面
      await this.driver.get("https://kyfw.12306.cn/otn/leftTicket/init");

      // 输入出发地
      const fromInput = await this.driver.wait(
        until.elementLocated(By.id("fromStationText")),
        10000
      );
      await fromInput.click();
      await fromInput.clear();
      await fromInput.sendKeys(fromStation, Key.RETURN);

      // 输入目的地
      const toInput = await this.driver.findElement(By.id("toStationText"));
      await toInput.click();
      await toInput.clear();
      await toInput.sendKeys(toStation, Key.RETURN);

      // 输入日期
      const dateInput = await this.driver.findElement(By.id("train_date"));
      await this.driver.executeScript(
        "arguments[0].removeAttribute('readonly')",
        dateInput
      );
      await dateInput.clear();
      await dateInput.sendKeys(date, Key.RETURN);

      // 点击查询按钮
      const searchBtn = await this.driver.findElement(By.id("query_ticket"));
      await searchBtn.click();

      // 等待查询结果
      await this.driver.wait(
        until.elementLocated(By.id("queryLeftTable")),
        10000
      );

      console.log("车票查询成功");
      return true;
    } catch (error) {
      console.error("查询车票失败:", error);
      return false;
    }
  }

  async selectTrain(trainNo, seatType) {
    try {
      // 等待车次列表加载
      await this.driver.wait(
        until.elementLocated(By.xpath("//tbody[@id='queryLeftTable']/tr")),
        10000
      );

      // 查找所有车次
      const trains = await this.driver.findElements(
        By.xpath("//tbody[@id='queryLeftTable']/tr[not(@datatran)]")
      );

      for (const train of trains) {
        try {
          const number = await train
            .findElement(By.className("number"))
            .getText();
          console.log("###########1", trainNo, number);
          // 如果指定了车次，且当前车次不匹配，则跳过
          if (trainNo && number !== trainNo) {
            continue;
          }

          // 检查座位类型是否有票
          let seatXpath;
          switch (seatType) {
            case "二等座":
              seatXpath = ".//td[4]";
              break;
            case "一等座":
              seatXpath = ".//td[3]";
              break;
            case "商务座":
              seatXpath = ".//td[2]";
              break;
            case "无座":
              seatXpath = ".//td[5]";
              break;
            default:
              seatXpath = ".//td[4]"; // 默认二等座
          }
          console.log("###########2", seatType, seatXpath);
          const seat = await train.findElement(By.xpath(seatXpath));
          const seatText = await seat.getText();
          console.log("###########3", seatText);
          if (seatText === "有" || !isNaN(seatText)) {
            // 点击预订按钮
            const bookBtn = await train.findElement(By.className("btn72"));
            await bookBtn.click();
            console.log(`已选择车次: ${number}`);
            return true;
          }
        } catch (error) {
          continue;
        }
      }

      console.log("没有找到符合条件的车次");
      return false;
    } catch (error) {
      console.error("选择车次失败:", error);
      return false;
    }
  }

  async selectPassenger(passengerName) {
    try {
      // 等待乘客选择页面加载
      await this.driver.wait(
        until.elementLocated(By.id("normalPassenger_0")),
        10000
      );

      // 选择乘客
      const passengerCheckbox = await this.driver.wait(
        until.elementLocated(
          By.xpath(`//label[contains(text(), '${passengerName}')]`)
        ),
        5000
      );
      await passengerCheckbox.click();

      // 点击提交订单
      const submitBtn = await this.driver.wait(
        until.elementLocated(By.id("submitOrder_id")),
        5000
      );
      await submitBtn.click();

      console.log("乘客选择成功");
      return true;
    } catch (error) {
      console.error("选择乘客失败:", error);
      return false;
    }
  }

  async confirmOrder() {
    try {
      // 等待确认页面加载
      await this.driver.wait(
        until.elementLocated(By.id("qr_submit_id")),
        10000
      );

      // 点击确认按钮
      const confirmBtn = await this.driver.wait(
        until.elementLocated(By.id("qr_submit_id")),
        5000
      );
      await this.sleep(60); // 等待60秒以确保订单提交成功
      await confirmBtn.click();
      console.log("订单确认成功");
      return true;
    } catch (error) {
      console.error("确认订单失败:", error);
      return false;
    }
  }

  async run(config) {
    try {
      await this.initBrowser();

      // 登录
      if (!(await this.login(config.username, config.password))) {
        return;
      }

      // 查询车票
      if (
        !(await this.searchTicket(
          config.fromStation,
          config.toStation,
          config.date
        ))
      ) {
        return;
      }

      // 循环尝试抢票
      let success = false;
      while (!success) {
        if (await this.selectTrain(config.trainNo, config.seatType)) {
          if (await this.selectPassenger(config.passengerName)) {
            if (await this.confirmOrder()) {
              success = true;
              console.log("抢票成功!");
              break;
            }
          }
        }

        // 5秒后刷新页面重新尝试
        console.log("未找到可用车票，5秒后重新尝试...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.driver.navigate().refresh();
      }
    } catch (error) {
      console.error("抢票过程中出错:", error);
    } finally {
      // 关闭浏览器
      await this.driver.quit();
    }
  }
}

// 配置参数
const config = {
  username: "18834177065",
  password: "jiwei123",
  fromStation: "北京丰台",
  toStation: "太原南",
  date: "2025-06-23", // 格式: YYYY-MM-DD
  passengerName: "纪计伟", // 乘车人姓名
  trainNo: "G621", // 可选，指定车次
  seatType: "二等座", // 座位类型
};

// 运行抢票程序
const grabber = new TicketGrabber();
grabber.run(config);
