# 百度地图相关

[官方文档](https://lbsyun.baidu.com/index.php?title=jspopularGL)

## 获取当前城市

```js
export function getCurrentCity() {
  let city = JSON.parse(localStorage.getItem('my-city'))
  if(!city){
    return new Promise((resolve,reject) => {
      // 1. 获取当前定位城市
      const mycity = new window.BMap.LocalCity() 
      mycity.get(async (res) => {
        let cityName = res.name
        console.log(cityName)
        // 2. 根据城市名字获取当前定位城市
        const localCity = await API({
          url: '/area/info?name=' + cityName
        })
        localStorage.setItem('my-city', JSON.stringify(localCity.data.body))
        resolve(localCity.data.body)
      })
    })
  }
  // Promise 的简写形式
  return Promise.resolve(city)
}
```

## 设置中心点和地图级别

```html
<div id="container"></div>
<script>
  const map = new window.BMap.Map("container");
  const point = new window.BMap.point(116.404, 39.915)
  map.centerAndZoom(point, 11)
</script>
```

## 地图添加控件

```js
map.addControl(new window.BMap.NavigationControl());    // 平移缩放控件
map.addControl(new window.BMap.ScaleControl({
    anchor: BMAP_ANCHOR_TOP_RIGHT
}));     // 比例尺控件
map.addControl(new window.BMap.OverviewMapControl());  // 缩略地图
map.addControl(new window.BMap.MapTypeControl());  // 地图类型
map.addControl(new window.BMap.GeolocationControl());  // 地图定位
```

## 覆盖物

```js
let point = new window.BMap.Point(116.404, 39.915);
const opts = {
  position: point,    // 指定文本标注所在的地理位置
  offset: new window.BMap.Size(-35, -35)    //设置文本偏移量
}
const label = new window.BMap.Label("", opts);
label.setContent(`
	<div class="xx">地图覆盖物</div>
`)
label.setStyle({
  padding: 0,
  border: "0 none"
});
label.addEventListener('click',(e)=>{console.log("地图覆盖物点击了")});
map.addOverlay(label); // 添加覆盖物
map.clearOverlays(); // 清除所有覆盖物
map.getZoom(); // 获取地图等级
map.enableScrollWheelZoom(); // 启用滚轮放大缩小,默认禁用
```

## 地址解析

```js
const myGeo = new window.BMap.Geocoder();
myGeo.getPoint("北京市昌平区沙河高教园", (point)=>{
	console.log("得到的地图坐标", point)
}, "北京")
```

## 自定义Marker图标

```js
const map = new BMapGL.Map('container');
const point = new BMapGL.Point(116.404, 39.915);
map.centerAndZoom(point, 15);
// 创建小车图标
const myIcon = new BMapGL.Icon("/jsdemo/img/car.png", new BMapGL.Size(52, 26));
// 自定义点的位置
const pt = new BMapGL.Point(116.417, 39.909);
// 创建Marker标注，使用小车图标
const marker = new BMapGL.Marker(pt, {
    icon: myIcon
});
// 将标注添加到地图
map.addOverlay(marker);
```

## GPS坐标转百度坐标

```js
function translate(x, y) {
  return new Promise((resolve, reject) => {
    const BMapGL = window.BMapGL;
    const point = new BMapGL.Point(x,y);
    const convertor = new BMapGL.Convertor();
    const pointArr = [];
    pointArr.push(point);
    convertor.translate(pointArr, window.COORDINATES_WGS84, window.COORDINATES_BD09, (data) => {
      if(data.status === 0 ) {
        resolve(data.points)
      } else {
        reject(data)
      }  
    })
  })
}
await translate(116.32715863448607,  39.990912172420714); // [{"lng": 116.33993794568, "lat":39.9979082195}]
```

## 添加轨迹动画

```js
const bmap = new BMapGL.Map("allmap"); // 创建Map实例
bmap.centerAndZoom(new BMapGL.Point(116.297611, 40.047363), 17); // 初始化地图，设置中心点坐标和地图级别
bmap.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
const path = [{
    'lng': 116.297611,
    'lat': 40.047363
}, {
    'lng': 116.302839,
    'lat': 40.048219
}, {
    'lng': 116.308301,
    'lat': 40.050566
}, {
    'lng': 116.305732,
    'lat': 40.054957
}, {
    'lng': 116.304754,
    'lat': 40.057953
}, {
    'lng': 116.306487,
    'lat': 40.058312
}, {
    'lng': 116.307223,
    'lat': 40.056379
}];
const point = [];
for (let i = 0; i < path.length; i++) {
    point.push(new BMapGL.Point(path[i].lng, path[i].lat));
}
const pl = new BMapGL.Polyline(point);
const trackAni = new BMapGLLib.TrackAnimation(bmap, pl, {
  overallView: true, // 动画完成后自动调整视野到总览
  tilt: 30, // 轨迹播放的角度，默认为55
  duration: 20000, // 动画持续时长，默认为10000，单位ms
  delay: 3000, // 动画开始的延迟，默认0，单位ms
});
// 启动动画
trackAni.start();
// 强制停止动画
trackAni.cancel();
```

## 隐藏版权信息

```css
/* 去掉版权信息 */
:deep(.anchorBL) {
  display: none;
}
```

# echarts

[echarts配置文档](https://echarts.apache.org/zh/option.html#title)

## 基本使用

```html
<div id="container"></div>
<script>
  import * as echarts from "echarts";
  const myChart = echarts.init(document.getElementById("container"));
  const option = {}; // 配置项
  myChart.setOption(option);
</script>
```

## 地图

[获取地图数据](https://datav.aliyun.com/portal/school/atlas/area_selector)

```js
import chinaJson from "@/utils/china.json";
echarts.registerMap("china", chinaJson); //注册可用的地图
const option = {
  geo: {
    show: true,
    center: [105.194115019531, 35.582111640625], //设置中心点
    map: "china",
  }
}; // 配置项
```

## 销毁实例

```js
const myChart = echarts.init(document.getElementById("container"));
myChart.dispose();
```

## 折线图

```html
<div style="width: 100%; height: 500px"></div>
<script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.common.js"></script>
<script>
  const mCharts = echarts.init(document.querySelector("div"));
  const pieData = [
    {
      name: "2021-11-11",
      value: 9231,
      伙食费: 2130,
      房贷: 4323,
    },
    {
      name: "2021-11-12",
      value: 3231,
      伙食费: 2130,
      房贷: 4323,
    },
    {
      name: "2021-11-13",
      value: 11231,
      伙食费: 2130,
      房贷: 4323,
    },
    {
      name: "2021-11-14",
      value: 4231,
      伙食费: 2130,
      房贷: 4323,
    },
  ];
  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const data = params[0].data;
        return `${data.name}<br>伙食费: ${data.伙食费}<br>房贷 :${data.房贷}`;
      },
    },
    grid: {
      left: "2%",
      right: "3%",
      bottom: "1%",
      containLabel: true,
    },
    legend: {
      show: true,
      icon: "circle",
      selectedMode: "single",
    },
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
    ],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["2021-11-11", "2021-11-12", "2021-11-13", "2021-11-14"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        data: pieData,
        radius: [60, 140],
        selectedMode: "multiple", // 多个可以选中
        label: {
          show: true,
          position: "top",
          formatter: "{c}元",
        },
      },
    ],
  };
  mCharts.setOption(option);
</script>
```

