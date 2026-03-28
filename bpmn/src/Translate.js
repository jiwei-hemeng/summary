import bpmn from "bpmn-js-i18n-zh/lib/bpmn-js";
import properties from "bpmn-js-i18n-zh/lib/properties-panel";
import camunda from "bpmn-js-i18n-zh/lib/camunda-properties-panel";
import zeebe from "bpmn-js-i18n-zh/lib/zeebe-properties-panel";

const zhCN = {
  ...bpmn,
  ...properties,
  ...camunda,
  ...zeebe,
  // 可以在这里加上需要修改的部分内容
};

export function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = zhCN[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || "{" + key + "}";
  });
}

export default {
  translate: ["value", customTranslate],
};
