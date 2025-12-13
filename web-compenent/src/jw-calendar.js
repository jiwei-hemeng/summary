import JwCompenent from "./jw-compenent";
class JwCalendar extends JwCompenent {
  static observedAttributes = ["default-value"];
  constructor() {
    super();
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.hoverDate = null; // 鼠标悬停
    this.currentMon = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      1
    ); // 弹层当前左月
    this.maxMonth = 12; // 最多显示 12 个月
    this.state = {
      value: "",
      start: null,
      end: null,
      nightCount: 0,
    };
  }
  mounted() {
    console.log("组件加载完成");
  }

  format(d, sep = "-") {
    if (d) {
      d = new Date(d);
      return (
        d.getFullYear() +
        sep +
        String(d.getMonth() + 1).padStart(2, "0") +
        sep +
        String(d.getDate()).padStart(2, "0")
      );
    }
    return null;
  }
  parse(str) {
    return new Date(str.replace(/-/g, "/"));
  }
  onChange(e) {
    this.state.value = e;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: e,
      })
    );
  }
  dateBarClick(e) {
    e.stopPropagation(); // 如果日历已经显示，则关闭它
    if (
      this.shadowRoot.querySelector("#calendarWrap").style.display === "block"
    ) {
      this.close();
      return;
    }
    if (!this.state.start) {
      this.currentMon = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        1
      );
    } else if (
      !this.shadowRoot.querySelector(".modal-wrap").style.display ||
      this.shadowRoot.querySelector(".modal-wrap").style.display === "none"
    ) {
      this.currentMon = new Date(
        this.state.start.getFullYear(),
        this.state.start.getMonth(),
        1
      );
    }
    this.renderCalendar();
    this.shadowRoot.querySelector("#calendarWrap").style.display = "block"; // 计算并设置日历位置
    var dateBarRect = this.shadowRoot
      .querySelector("#dateBar")
      .getBoundingClientRect();
    this.shadowRoot.querySelector("#calendarWrap").style.left =
      dateBarRect.left + "px";
    this.shadowRoot.querySelector("#calendarWrap").style.top =
      dateBarRect.bottom + 5 + "px";
  }
  renderCalendar() {
    this.shadowRoot.querySelector("#calendarBox").innerHTML = ""; // 画两个月
    this.shadowRoot
      .querySelector("#calendarBox")
      .appendChild(this.createMonthTable(this.currentMon, "first"));
    this.shadowRoot
      .querySelector("#calendarBox")
      .appendChild(
        this.createMonthTable(this.nextMonth(this.currentMon), "second")
      );
  }
  nextMonth(d) {
    var n = new Date(d);
    n.setMonth(n.getMonth() + 1);
    return n;
  }
  createMonthTable(mon, position) {
    var box = document.createElement("div");
    box.className = "month-box";
    var hd = document.createElement("div");
    hd.className = "month-hd";
    if (position === "first") {
      hd.innerHTML = `<span class="arrow" id="prev">&lt;</span> <span>${mon.getFullYear()}年${
        mon.getMonth() + 1
      }月</span> <span></span>`;
    } else {
      hd.innerHTML = `<span></span> <span>${mon.getFullYear()}年${
        mon.getMonth() + 1
      }月</span> <span class="arrow" id="next">&gt;</span>`;
    }
    box.appendChild(hd);
    var table = document.createElement("table");
    var head = document.createElement("thead");
    head.innerHTML =
      "<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>";
    table.appendChild(head);
    var firstDay = new Date(mon.getFullYear(), mon.getMonth(), 1);
    var lastDay = new Date(mon.getFullYear(), mon.getMonth() + 1, 0);
    var tr = document.createElement("tr");
    // 补前空
    var startWeek = firstDay.getDay();
    for (var i = 0; i < startWeek; i++) {
      var td = document.createElement("td");
      td.className = "old";
      tr.appendChild(td);
    }
    // 日期单元
    for (var d = firstDay.getDate(); d <= lastDay.getDate(); d++) {
      if (tr.children.length === 7) {
        table.appendChild(tr);
        tr = document.createElement("tr");
      }
      var cellDate = new Date(mon.getFullYear(), mon.getMonth(), d);
      var td = this.createCell(cellDate);
      tr.appendChild(td);
    } // 补后空
    while (tr.children.length < 7) {
      var td = document.createElement("td");
      td.className = "new";
      tr.appendChild(td);
    }
    table.appendChild(tr);
    box.appendChild(table);
    box.addEventListener("click", (e) => this.mainClick.call(this, e));
    return box;
  }
  createCell(d) {
    var td = document.createElement("td");
    var time = d.getTime();
    td.textContent = d.getDate();
    td.dataset.date = this.format(d); // 不可选（今天之前）
    if (time < this.today.getTime()) {
      td.classList.add("disabled", "old");
      return td;
    } // 已选区间
    if (this.state.start && this.state.end) {
      if (time === this.state.start.getTime()) td.classList.add("start");
      else if (time === this.state.end.getTime()) td.classList.add("end");
      else if (
        time > this.state.start.getTime() &&
        time < this.state.end.getTime()
      )
        td.classList.add("range");
    }
    if (this.state.start && !this.state.end) {
      if (time === this.state.start.getTime()) td.classList.add("start");
      if (time < this.state.start.getTime()) {
        td.classList.add("disabled", "old");
        return td;
      }
    }
    td.onmouseenter = () => {
      this.hoverDate = d;
      this.refreshHover();
    };
    td.onmouseleave = () => {
      this.hoverDate = null;
      this.refreshHover();
    };
    // 点击逻辑
    td.onclick = (e) => {
      e.stopPropagation();
      if (!this.state.start || (this.state.start && this.state.end)) {
        // 重选入住
        this.state.start = new Date(d);
        this.state.end = null;
      } else {
        // 选离店，离店必须晚于入住
        if (d <= this.state.start) return;
        this.state.end = new Date(d);
      }
      this.updateCalendarStyles();
      this.state.nightCount = this.updateBar(); // 选择完第二个日期后自动关闭弹窗
      if (this.state.start && this.state.end) {
        setTimeout(() => this.close(), 100);
        this.onChange({ start: this.state.start, end: this.state.end });
      }
    };
    return td;
  }
  refreshHover() {
    // 仅当已选入住、未选离店时才有 hover 预览
    if (!this.state.start || this.state.end) return;
    this.shadowRoot.querySelectorAll("td[data-date]").forEach((td) => {
      var d = this.parse(td.dataset.date);
      td.classList.remove("range");
      if (this.hoverDate && d > this.state.start && d < this.hoverDate) {
        td.classList.add("range");
      }
    });
  }
  updateBar() {
    if (this.state.start && this.state.end) {
      var nights = Math.ceil(
        (this.state.end - this.state.start) / (1000 * 60 * 60 * 24)
      );
      return nights;
    }
    return 0;
  }
  close() {
    this.shadowRoot.querySelector("#calendarWrap").style.display = "none";
  }
  nextMonth(d) {
    var n = new Date(d);
    n.setMonth(n.getMonth() + 1);
    return n;
  }
  changeMonth(delta) {
    var newMon = new Date(this.currentMon);
    newMon.setMonth(newMon.getMonth() + delta);
    // 控制范围：最早今天所在月，最多后 maxMonth 个月
    var minMon = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    var maxMon = new Date(
      this.today.getFullYear(),
      this.today.getMonth() + this.maxMonth,
      1
    );
    if (newMon < minMon || newMon > maxMon) return;
    this.currentMon = newMon;
    this.renderCalendar();
  }
  updateCalendarStyles() {
    this.shadowRoot.querySelectorAll("td[data-date]").forEach((td) => {
      var d = this.parse(td.dataset.date);
      var time = d.getTime();
      // 清除旧样式
      td.classList.remove("start", "end", "range");
      // 应用新样式
      if (this.state.start && this.state.end) {
        if (time === this.state.start.getTime()) {
          td.classList.add("start");
        } else if (time === this.state.end.getTime()) {
          td.classList.add("end");
        } else if (
          time > this.state.start.getTime() &&
          time < this.state.end.getTime()
        ) {
          td.classList.add("range");
        }
      }
      if (this.state.start && !this.state.end) {
        if (time === this.state.start.getTime()) td.classList.add("start");
        if (time < this.state.start.getTime()) {
          td.classList.add("disabled", "old");
        }
      }
    });
  }
  mainClick(e) {
    if (e.target.id === "prev") {
      this.changeMonth(-1);
    } else if (e.target.id === "next") {
      this.changeMonth(1);
    }
  }
  render() {
    return this.html`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: #f5f5f5;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: #0086f6;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 500;
        }
        .main {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 500px;
        }
        .date-bar {
          display: flex;
          align-items: center;
          width: 350px;
          background: #fff;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          height: 44px;
          cursor: pointer;
          user-select: none;
          position: relative;
          z-index: 1000;
        }
        .date-bar .item {
          flex: 1;
          text-align: center;
          position: relative;
        }
        .date-bar .item:last-child::after {
          display: none;
        }
        .date-bar .label {
          font-size: 12px;
          color: #999;
          margin-bottom: 2px;
        }
        .date-bar .val {
          font-size: 14px;
          color: #333;
        }
        #nightCount {
          display: inline-block;
          width: 32px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -9px;
          margin-left: -15px;
          font-size: 14px;
          color: #666;
          z-index: 1;
        }
        #nightCount::before {
          content: "";
          position: absolute;
          height: 1px;
          width: 11px;
          top: 9px;
          left: -13px;
          background-color: #dadfe6;
        }
        #nightCount::after {
          content: "";
          position: absolute;
          height: 1px;
          width: 11px;
          top: 9px;
          left: 34px;
          background-color: #dadfe6;
        }
        .modal-wrap {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 5px;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: none;
        }
        .modal-bd {
          display: flex;
        }
        .month-box {
          width: 260px;
          padding: 0 15px 15px;
        }
        .month-hd {
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-weight: 500;
          font-size: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .month-hd .arrow {
          font-size: 20px;
          cursor: pointer;
          color: #666;
          padding: 0 8px;
        }
        .month-hd .arrow:hover {
          color: #0086f6;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table th {
          font-size: 12px;
          color: #999;
          height: 30px;
        }
        table td {
          text-align: center;
          height: 32px;
          font-size: 14px;
          cursor: pointer;
          position: relative;
        }
        table td.old,
        table td.new {
          color: #ccc;
          cursor: not-allowed;
        }
        table td.today {
          color: #0086f6;
          font-weight: 700;
        }
        table td.start,
        table td.end {
          background: #0086f6;
          color: #fff;
        }
        table td.range {
          background: #bfe0fc;
          color: #fff;
        }
        table td:hover:not(.disabled):not(.old):not(.new) {
          background: #4daaf8;
          color: #fff;
        }
      </style>
      <div class="container">
      <div class="header">
        <h1>仿携程双日期选择</h1>
      </div>

      <div class="main" @click="${(e) => this.mainClick.bind(this, e)}">
        <div class="date-bar" id="dateBar" @click="${(e) => {
          this.dateBarClick.call(this, e);
        }}">
          <div class="item">
            <div class="label">入住</div>

            <div class="val" id="checkInStr">${
              this.state.start ? this.format(this.state.start) : "请选择日期"
            }</div>
          </div>

          <div class="val" id="nightCount">${this.state.nightCount}晚</div>

          <div class="item">
            <div class="label">退房</div>

            <div class="val" id="checkOutStr">${
              this.state.end ? this.format(this.state.end) : "请选择日期"
            }</div>
          </div>
        </div>

        <div class="modal-wrap" id="calendarWrap">
          <div class="modal-bd" id="calendarBox"></div>
        </div>
      </div>
    `;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "default-value") {
      this.state.value = newValue;
      if (newValue) {
        const [start, end] = newValue.split(",");
        const selectedIn = new Date(start);
        selectedIn.setHours(0, 0, 0, 0);
        const selectedOut = new Date(end);
        selectedOut.setHours(0, 0, 0, 0);
        this.state.start = selectedIn;
        this.state.end = selectedOut;
        this.state.nightCount = this.updateBar.call(this);
      }
    }
  }
}
customElements.define("jw-calendar", JwCalendar);
