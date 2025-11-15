import { html, render } from "lit-html";
import { reactive, isReactive, effect } from "@vue/reactivity";
export default class JwCompenent extends HTMLElement {
  html = html;
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    if (!isReactive(this.state)) {
      this.state = reactive(this.state || {});
    }
    effect(() => {
      console.log("rendering...");
      const content = this.render();
      render(content, this.shadowRoot);
    });
  }
}
