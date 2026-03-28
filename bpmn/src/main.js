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

document.getElementById("save").addEventListener("click", saveXML);
