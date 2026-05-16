import JwCompenent from "./jw-compenent";
class JwSwitch extends JwCompenent {
  static observedAttributes = ["default-checked"];
  state = {
    checked: false,
  };
  onChange(e) {
    this.state.checked = e.target.checked;
  }
  render() {
    return this.html`
      <style>
      .switch {
        position: relative;
        height: 1.5rem;
        width: 3rem;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        border-radius: 9999px;
        background-color: rgba(100, 116, 139, 0.377);
        transition: all .3s ease;
      }

      .switch:checked {
        background-color: rgba(236, 72, 153, 1);
      }

      .switch::before {
        position: absolute;
        content: "";
        left: calc(1.5rem - 1.6rem);
        top: calc(1.5rem - 1.6rem);
        display: block;
        height: 1.6rem;
        width: 1.6rem;
        cursor: pointer;
        border: 1px solid rgba(100, 116, 139, 0.527);
        border-radius: 9999px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0 3px 10px rgba(100, 116, 139, 0.327);
        transition: all .3s ease;
      }

      .switch:hover::before {
        box-shadow: 0 0 0px 8px rgba(0, 0, 0, .15)
      }

      .switch:checked:hover::before {
        box-shadow: 0 0 0px 8px rgba(236, 72, 153, .15)
      }

      .switch:checked:before {
        transform: translateX(100%);
        border-color: rgba(236, 72, 153, 1);
      }
      </style>
      <div>
        <input class="switch" name='xxx' type="checkbox" @change=${this.onChange.bind(
          this
        )} checked="${this.state.checked}">
      </div>
    `;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "default-checked") {
      console.log("#################", oldValue, newValue);
      this.state.checked = newValue === "true";
    }
  }
}
customElements.define("jw-switch", JwSwitch);
