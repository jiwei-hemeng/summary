import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat } from "ol/proj";
import { XYZ } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { LineString } from "ol/geom";
import Draw from "ol/interaction/Draw";
import "ol/ol.css";
import "./style.css";

const mapDom = document.querySelector("#map");

// 假设你有以下经纬度点（北京到上海的一段示例路径）
const coordinates = [
  [116.4074, 39.9042], // 北京
  [117.2008, 39.0851], // 天津方向
  [118.4647, 38.0428], // 济南方向
  [121.4737, 31.2304], // 上海
];

// 转换为 map 使用的投影坐标（通常是 EPSG:3857）
const lineString = new LineString(
  coordinates.map((coord) => fromLonLat(coord))
);

// 创建要素
const routeFeature = new Feature({
  geometry: lineString,
  type: "route",
});

// 设置样式（可选）
routeFeature.setStyle(
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "blue",
      width: 3,
    }),
  })
);

// 创建向量源和图层
const vectorSource = new VectorSource({
  features: [routeFeature],
});
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

// 创建地图
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
    vectorLayer, // 添加路径图层
  ],
  view: new View({
    center: fromLonLat([116.4074, 39.9042]),
    zoom: 5, // 调整缩放级别以便看到整个路径
    minZoom: 1,
    maxZoom: 18,
  }),
});
