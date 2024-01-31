// ==UserScript==
// @name         滚动条样式
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  修改滚动条默认样式
// @author       jjw
// @match        http://10.10.10.252
// @match        http://10.10.10.251:30113/*
// @match        http://git.lilianinfo.com/*
// @match        https://gitee.com/*
// @match        https://github.com/*
// @match        http://49.232.226.10:10082/*
// @match        https://ant-design.antgroup.com/*
// @match        https://2x.ant.design/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const styles = `
    /* 滚动条样式 */
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    /* 当同时含有垂直和水平方向的滚动条时它们的交叉部分。一般是元素的右下角 */
    ::-webkit-scrollbar-corner {
      background: #c0c0c0;
    }
    /* 滚动条上的滚动滑块 */
    ::-webkit-scrollbar-thumb {
      background: #00000033;
      border-radius: 4px;
    }
    /* 滚动条轨道 */
    ::-webkit-scrollbar-track {
      background: #f8f9fa;
    }
    /* 滚动条没有滑块的轨道部分 */
    ::-webkit-scrollbar-track-piece {
      background: #f8f9fa;
    }
  `;
  let timer = null;
  const style = document.createElement("style");
  style.innerText = styles;
  document.querySelector("head").appendChild(style);
})();
