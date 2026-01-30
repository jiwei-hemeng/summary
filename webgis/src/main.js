import { Feature, Map, View } from "ol";
// 导入瓦片层
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat } from "ol/proj";
import { XYZ } from "ol/source";
// 导入向量层
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import Icon from "./icon.svg";
import { Draw } from "ol/interaction";
import "ol/ol.css";
import "./style.css";
const mapDom = document.querySelector("#map");
const token = "3ae5c8d194b04200a60fd8ab69b05365";
const map = new Map({
  target: mapDom,
  layers: [
    new TileLayer({
      source: new XYZ({
        url: `http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${token}`,
      }),
    }),
    new TileLayer({
      source: new XYZ({
        url: `http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${token}`,
      }),
    }),
  ],
  view: new View({
    center: fromLonLat([116.4074, 39.9042]),
    zoom: 1,
    minZoom: 1,
    maxZoom: 13,
  }),
});
// 添加层
map.addLayer(
  new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new Point(fromLonLat([116.4074, 39.9042])),
          heading: 0.5 * Math.PI, // 自定义的属性
        }),
        new Feature({
          geometry: new Point(fromLonLat([114.30255, 22.543])),
          heading: Math.PI, // 自定义的属性
        }),
        new Feature({
          geometry: new Point(
            fromLonLat([112.52800855830216, 37.91300900815335]),
          ),
          heading: 1.5 * Math.PI, // 自定义的属性
        }),
      ],
    }),
    style: {
      "icon-src": Icon,
      "icon-width": 20,
      "icon-height": 20,
      "icon-rotate-with-view": true,
      "icon-anchor": [0.5, 0.5],
      "icon-rotation": ["get", "heading"],
    },
  }),
);

// 用于存储绘制的多边形
const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: {
    "fill-color": "rgba(100, 150, 255, 0.2)",
    "stroke-color": "#007cba",
    "stroke-width": 2,
  },
});
// 添加绘制交互（绘制多边形）
const draw = new Draw({
  source: vectorSource,
  type: "Polygon", // 绘制多边形（四边形）
  maxPoints: 4, // 限制最多4个点（形成四边形）
});
map.addInteraction(draw);

map.addLayer(vectorLayer);
// 监听绘制完成事件
draw.on("drawend", (e) => {
  const coordinates = e.feature.getGeometry().getCoordinates()[0]; // 获取多边形顶点坐标
  const lonLatCoords = coordinates.map((coord) => toLonLat(coord)); // 转为经纬度
  console.log("四边形顶点经纬度:", lonLatCoords);

  // 可选：移除绘制交互（防止重复绘制）
  // map.removeInteraction(draw);
});

// 点击地图获取坐标
map.on("click", (e) => {
  console.log("点击位置经纬度:", toLonLat(e.coordinate));
});
