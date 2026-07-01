/**
 * 标题：      index.vue
 * 功能：      form-label全局处理
 * 说明：      页面上所有 a-form 的 label，超过 6 个字时：
 *   - 页面上只显示前 6 个字 + "..."
 *   - 鼠标移上去，用 Ant Design 的 a-tooltip 显示完整文字
 * 当前版本：   1.0
 * 开发信息：   Created by 姚磊 2026-06-15
 * 修改记录：
 * 修改人：        姚磊
 *  -  2026-06-15：创建文件
 */
import type { App } from 'vue';
import { createVNode, render } from 'vue';
import { Tooltip } from 'ant-design-vue';

/** 超过多少个字才做省略（中文 1 个汉字算 1 个字） */
const MAX = 6;

/**
 * 从 label 元素里取出纯文字（去掉必填红星 *）
 * 例如 label 里是「数据产品标识码 *」，返回「数据产品标识码」
 */
const getLabelText = (el: HTMLElement) => {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.ant-form-item-required').forEach((n) => n.remove());
  return (clone.textContent || '').trim().replace(/^\*\s*/, '');
};

/** 判断某个 DOM 节点是不是必填红星 */
const isStar = (node: Node) =>
  node instanceof HTMLElement && node.classList.contains('ant-form-item-required');

/**
 * 启动全局 label 处理
 * @param app Vue 应用实例，需要用到它的上下文来渲染 a-tooltip
 */
export const setupFormLabelTooltip = (app: App) => {
  const ctx = app._context;

  /** 扫描页面上所有还没处理过的 label，逐个判断要不要加省略和 tooltip */
  const run = () => {
    document.querySelectorAll('.ant-form-item-label label:not([data-label-tip])').forEach((node) => {
      const label = node as HTMLElement;
      const text = getLabelText(label);

      label.setAttribute('data-label-tip', '1');

      if (text.length <= MAX) return;

      const stars: Node[] = [];
      Array.from(label.childNodes).forEach((n) => {
        if (isStar(n)) {
          stars.push(n);
        } else {
          label.removeChild(n);
        }
      });

      const host = document.createElement('span');
      label.insertBefore(host, label.firstChild);

      stars.forEach((n) => label.appendChild(n));

      const vnode = createVNode(
        Tooltip,
        { title: text, placement: 'top', mouseEnterDelay: 0.2 },
        { default: () => createVNode('span', null, `${text.slice(0, MAX)}...`) }
      );
      vnode.appContext = ctx;
      render(vnode, host);
    });
  };

  run();

  new MutationObserver(() => setTimeout(run, 80)).observe(document.body, { childList: true, subtree: true });
};
