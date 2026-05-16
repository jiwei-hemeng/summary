import { LitElement, html, css } from "lit";

class SimpleCarousel extends LitElement {
  static styles = css`
    :host {
      display: block;
      --carousel-height: 450px;
      --control-bg: rgba(0, 0, 0, 0.5);
      --control-hover-bg: rgba(0, 0, 0, 0.8);
      --indicator-active: #ffffff;
      --indicator-inactive: rgba(255, 255, 255, 0.5);
      box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    .carousel-container {
      position: relative;
      width: 100%;
      height: var(--carousel-height);
      overflow: hidden;
      border-radius: 1rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    }

    .slides-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .slides-track {
      display: flex;
      height: 100%;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
      /* 关键修复：强制不换行 */
      white-space: nowrap;
    }

    /* 核心修复：强制每一张轮播图占满容器，绝不溢出 */
    ::slotted([slot="item"]) {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      flex: 0 0 100% !important;
      object-fit: cover !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      outline: none !important;
      overflow: hidden !important;
    }

    /* 导航按钮 */
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--control-bg);
      backdrop-filter: blur(4px);
      color: white;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.8rem;
      font-weight: bold;
      z-index: 10;
      opacity: 0.7;
      user-select: none;
    }

    .nav-btn:hover {
      background: var(--control-hover-bg);
      opacity: 1;
      transform: translateY(-50%) scale(1.05);
    }

    .btn-prev {
      left: 1rem;
    }

    .btn-next {
      right: 1rem;
    }

    /* 指示器 */
    .indicators {
      position: absolute;
      bottom: 1.5rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      z-index: 10;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--indicator-inactive);
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      border: none;
      backdrop-filter: blur(2px);
    }

    .dot.active {
      background: var(--indicator-active);
      transform: scale(1.2);
      width: 24px;
      border-radius: 10px;
    }

    .pause-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      z-index: 10;
      backdrop-filter: blur(4px);
      pointer-events: none;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      :host {
        --carousel-height: 300px;
      }
      .nav-btn {
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
      }
    }
  `;

  static properties = {
    currentIndex: { type: Number, state: true },
    autoPlay: { type: Boolean, reflect: true },
    interval: { type: Number, reflect: true },
    totalItems: { type: Number, state: true },
    isHovering: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.currentIndex = 0;
    this.autoPlay = true;
    this.interval = 3000;
    this.totalItems = 0;
    this.isHovering = false;
    this._intervalId = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._startAutoPlay();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAutoPlay();
  }

  updated(changedProperties) {
    if (
      changedProperties.has("autoPlay") ||
      changedProperties.has("interval")
    ) {
      this._restartAutoPlay();
    }
    if (
      changedProperties.has("totalItems") &&
      this.currentIndex >= this.totalItems &&
      this.totalItems > 0
    ) {
      this.currentIndex = 0;
    }
  }

  _handleSlotChange() {
    const slot = this.shadowRoot.querySelector('slot[name="item"]');
    if (slot) {
      this.totalItems = slot.assignedElements().length;
      if (this.currentIndex >= this.totalItems && this.totalItems > 0) {
        this.currentIndex = 0;
      }
    }
  }

  _prevSlide() {
    if (this.totalItems <= 1) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.totalItems) % this.totalItems;
    this._restartAutoPlay();
  }

  _nextSlide() {
    if (this.totalItems <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.totalItems;
    this._restartAutoPlay();
  }

  _goToSlide(index) {
    if (index < 0 || index >= this.totalItems) return;
    this.currentIndex = index;
    this._restartAutoPlay();
  }

  _startAutoPlay() {
    if (this._intervalId) clearInterval(this._intervalId);
    if (this.autoPlay && this.totalItems > 1 && !this.isHovering) {
      this._intervalId = setInterval(() => this._nextSlide(), this.interval);
    }
  }

  _stopAutoPlay() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  _restartAutoPlay() {
    this._stopAutoPlay();
    this._startAutoPlay();
  }

  _onMouseEnter() {
    this.isHovering = true;
    this.autoPlay && this._stopAutoPlay();
  }

  _onMouseLeave() {
    this.isHovering = false;
    this.autoPlay && this._startAutoPlay();
  }

  render() {
    const offset = -this.currentIndex * 100;
    const indicators = [];

    for (let i = 0; i < this.totalItems; i++) {
      indicators.push(html`
        <button
          class="dot ${i === this.currentIndex ? "active" : ""}"
          @click=${() => this._goToSlide(i)}
        ></button>
      `);
    }

    return html`
      <div
        class="carousel-container"
        @mouseenter=${this._onMouseEnter}
        @mouseleave=${this._onMouseLeave}
      >
        <div class="slides-wrapper">
          <div class="slides-track" style="transform: translateX(${offset}%)">
            <slot name="item" @slotchange=${this._handleSlotChange}></slot>
          </div>
        </div>

        ${this.totalItems > 1
          ? html`
              <button class="nav-btn btn-prev" @click=${this._prevSlide}>
                ‹
              </button>
              <button class="nav-btn btn-next" @click=${this._nextSlide}>
                ›
              </button>
              <div class="indicators">${indicators}</div>
            `
          : ""}

        <div class="pause-indicator">
          ${this.autoPlay && !this.isHovering && this.totalItems > 1
            ? "自动播放中"
            : "暂停"}
        </div>
      </div>
    `;
  }
}

customElements.define("jw-carousel", SimpleCarousel);
