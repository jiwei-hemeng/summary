// ==UserScript==
// @name         自定义滚动条
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  try to take over the world!
// @author       You
// @match        http://10.10.10.252*
// @match        http://localhost*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const scrollbar = document.createElement("link");
  scrollbar.setAttribute("rel", "stylesheet");
  scrollbar.setAttribute(
    "href",
    "https://jiwei-hemeng.github.io/assets/scrollbar.css"
  );
  document.querySelector("head").appendChild(scrollbar);
})();
