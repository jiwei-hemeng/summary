# 百度地图相关

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
map.addControl(new window.BMap.ScaleControl());     // 比例尺控件
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

