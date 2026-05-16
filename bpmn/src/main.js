import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import camundaModdleDescriptors from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "./style.css";
import Translate from "./Translate";
import shoppingXml from "./default.xml?raw";
const modeler = new BpmnModeler({
  container: "#canvas",
  propertiesPanel: {
    parent: "#properties",
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
    Translate,
  ],
  moddleExtensions: {
    camunda: camundaModdleDescriptors,
  },
});

// 创建新流程图
await modeler.createDiagram();
await modeler.importXML(shoppingXml);
// 保存 XML
const saveXML = async () => {
  const { xml } = await modeler.saveXML({ format: true });
  console.log("保存成功:", xml);
  return xml;
};

let currentUserTaskElement = null;
// 选中某个节点时触发的事件
modeler.on("selection.changed", function (e) {
  if (
    e.newSelection.length === 1 &&
    e.newSelection[0].type === "bpmn:UserTask"
  ) {
    // 表示选中用户节点;
    currentUserTaskElement = e.newSelection[0];
    console.log("节点对象", currentUserTaskElement.businessObject);
    console.log("节点名称", currentUserTaskElement.businessObject.name);
    console.log("节点id", currentUserTaskElement.businessObject.id);
    document.querySelector("#input").value =
      currentUserTaskElement.businessObject.name;
  } else {
    currentUserTaskElement = null;
    document.querySelector("#input").value = "";
  }
});
// 更新数据
function updateModeler(e) {
  const modeling = modeler.get("modeling");
  modeling.updateProperties(currentUserTaskElement, {
    name: e.target.value,
  });
}

document.querySelector("#input").addEventListener("input", updateModeler);

document.getElementById("save").addEventListener("click", saveXML);
