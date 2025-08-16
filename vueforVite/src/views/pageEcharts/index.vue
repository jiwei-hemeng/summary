<template>
  <!-- 图表的容器，一定要有宽高 -->
  <div class="Box">
    <div class="pageButton">
      <div class="pageNev" id="nev" @click="dataClickNev"></div>
      <div class="pageNext" id="next" @click="dataClickNext"></div>
    </div>
    <div class="chartBox">
      <div id="dataChart" :style="{ width: '100%', height: '100%' }"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "PageEcharts",
  data() {
    return {
      allData: null, //模拟后台返回的数据
      echartsPage: 5, //五条数据一页
      currentPage: 1, //当前显示页数
      totalPage: 0 // 共有多少页
    };
  },
  mounted() {
    this.getChartsData();
  },
  methods: {
    //点击事件
    dataClickNext() {
      this.currentPage = this.currentPage + 1;
      this.drawEcharts();
    },
    dataClickNev() {
      this.currentPage = this.currentPage - 1;
      this.drawEcharts();
    },
    getChartsData() {
      //模拟后台返回的数据
      this.allData = {
        series: [120, 200, 150, 80, 70, 110, 130],
        xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      };
      //  每三个元素显示一页
      this.totalPage =
        this.allData.series.length % this.echartsPage === 0
          ? this.allData.series.length / this.echartsPage
          : Math.ceil(this.allData.series.length / this.echartsPage);
      this.drawEcharts();
    },
    //图表方法
    drawEcharts() {
      //获取id并初始化图表
      var myChart = echarts.init(document.getElementById("dataChart"));
      //控制分页图标的显示隐藏(处在第一页隐藏上一页，处在最后一页隐藏下一页)
      if (this.currentPage == this.totalPage) {
        document.getElementById("next").style.display = "none"; //隐藏
      } else {
        document.getElementById("next").style.display = "";
      }
      if (this.currentPage == 1) {
        document.getElementById("nev").style.display = "none"; //隐藏
      } else {
        document.getElementById("nev").style.display = "";
      }
      //取出页面的值
      const start = (this.currentPage - 1) * this.echartsPage;
      const end = this.currentPage * this.echartsPage;
      //配置项
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 20
        },
        xAxis: {
          type: "category",
          data: this.allData.xAxis.slice(start, end)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.allData.series.slice(start, end),
            type: "bar"
          }
        ]
      };
      myChart.setOption(option); //通过setOption()方法生成图表
      window.addEventListener("resize", function () {
        myChart.resize(); //图表自适应的一个方法
      });
    }
  }
};
</script>

<style scoped>
.Box {
  width: 320px;
  height: 230px;
  margin-left: 30%;
  position: relative;
}
.chartBox {
  width: 100%;
  height: 100%;
}
.pageButton {
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  z-index: 9999;
}
.pageNext {
  float: right;
  cursor: pointer;
  height: 6px;
  margin-right: 0.25rem;
  width: 6px;
  border-top: 2px solid #00a0e9;
  border-left: 2px solid #00a0e9;
  transform: rotate(135deg);
}
.pageNev {
  float: left;
  height: 6px;
  width: 6px;
  border-top: 2px solid #00a0e9;
  border-left: 2px solid #00a0e9;
  transform: rotate(-45deg);
  cursor: pointer;
  transition: all 0.28s ease;
}
</style>
