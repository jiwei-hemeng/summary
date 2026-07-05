<template>
  <a-modal
    v-model:open="visible"
    width="360px"
    centered
    :footer="null"
    :closable="false"
    :mask-closable="false"
    wrap-class-name="cyber-verify-dialog"
    @after-close="handleClosed"
  >
    <div class="cyber-verify">
      <div class="cyber-verify-header">
        <div class="cyber-verify-brand">
          <span class="cyber-verify-dot" :class="{ active: !loading, success: isSuccess }" />
          <div>
            <div class="cyber-verify-title">{{ titleText }}</div>
            <div class="cyber-verify-subtitle">{{ subtitleText }}</div>
          </div>
        </div>
        <div class="cyber-verify-actions">
          <button type="button" class="cyber-icon-btn" :title="refreshText" @click="refreshCaptcha">
            <ReloadOutlined :spin="loading" />
          </button>
          <button type="button" class="cyber-icon-btn" aria-label="close" @click="visible = false">
            <CloseOutlined />
          </button>
        </div>
      </div>

      <div
        ref="imageRef"
        class="cyber-verify-image"
        :class="{ success: isSuccess, fail: isFail, dragging: isDragging }"
        :style="{ width: `${PUZZLE_WIDTH}px`, maxWidth: '100%', height: `${PUZZLE_HEIGHT}px` }"
      >
        <span class="corner corner-tl" />
        <span class="corner corner-tr" />
        <span class="corner corner-bl" />
        <span class="corner corner-br" />

        <img
          v-if="captchaData"
          :src="captchaData.bgImage"
          class="cyber-bg"
          :width="PUZZLE_WIDTH"
          :height="PUZZLE_HEIGHT"
          alt="captcha background"
        />
        <img
          v-if="captchaData"
          :src="captchaData.blockImage"
          class="cyber-block"
          :class="{ fail: isFail, success: isSuccess }"
          :style="{
            width: `${blockDisplaySize}px`,
            height: `${blockDisplaySize}px`,
            transform: `translate(${blockOffsetX}px, ${blockOffsetY}px)`
          }"
          alt="captcha block"
        />

        <div class="scan-line" />
        <div class="grid-overlay" />

        <div v-if="loading" class="cyber-loading">
          <div class="cyber-spinner" />
          <span>{{ loadingText }}</span>
        </div>

        <transition name="status-fade">
          <div v-if="isSuccess" class="status-badge success">{{ successText }}</div>
          <div v-else-if="isFail" class="status-badge fail">{{ failText }}</div>
        </transition>
      </div>

      <div
        ref="trackRef"
        class="cyber-verify-track"
        :style="{ width: `${PUZZLE_WIDTH}px`, maxWidth: '100%' }"
        :class="{ success: isSuccess, fail: isFail, dragging: isDragging }"
      >
        <span v-show="!isSuccess && !isDragging" class="cyber-verify-tip">{{ tipText }}</span>
        <span v-show="isSuccess" class="cyber-verify-tip success">{{ successText }}</span>
        <div class="cyber-verify-progress" :style="{ width: `${progressWidth}px` }">
          <div class="progress-glow" />
        </div>
        <div
          class="cyber-verify-handle"
          :class="{ dragging: isDragging, success: isSuccess, fail: isFail }"
          :style="{ transform: `translateX(${offsetX}px)` }"
          @mousedown="onDragStart"
          @touchstart.prevent="onDragStart"
        >
          <CheckOutlined v-if="isSuccess" />
          <DoubleRightOutlined v-else />
        </div>
      </div>

      <div class="cyber-verify-footer">
        <span class="footer-tag">AI GUARD</span>
        <span class="footer-divider" />
        <span class="footer-status">{{ footerStatusText }}</span>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { CheckOutlined, CloseOutlined, DoubleRightOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import {
  createPuzzleCaptcha,
  getBlockOffsetX,
  PUZZLE_HEIGHT,
  PUZZLE_WIDTH,
  verifyPuzzleOffset,
  type PuzzleCaptchaResult
} from "@/utils/puzzleCaptcha";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  success: [payload: { offsetX: number; targetX: number }];
}>();

const { t } = useI18n();

const titleText = computed(() => t("slideVerify.title"));
const subtitleText = computed(() => t("slideVerify.subtitle"));
const refreshText = computed(() => t("slideVerify.refresh"));
const tipText = computed(() => t("slideVerify.tip"));
const successText = computed(() => t("slideVerify.success"));
const failText = computed(() => t("slideVerify.fail"));
const loadingText = computed(() => t("slideVerify.loading"));
const footerStatusText = computed(() => {
  if (isSuccess.value) return t("slideVerify.statusPassed");
  if (isFail.value) return t("slideVerify.statusFailed");
  if (isDragging.value) return t("slideVerify.statusScanning");
  return t("slideVerify.statusIdle");
});

const HANDLE_SIZE = 44;

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value)
});

const trackRef = ref<HTMLElement>();
const imageRef = ref<HTMLElement>();
const captchaData = ref<PuzzleCaptchaResult | null>(null);
const loading = ref(false);
const offsetX = ref(0);
const isDragging = ref(false);
const isSuccess = ref(false);
const isFail = ref(false);
const maxOffset = ref(0);
const displayWidth = ref(PUZZLE_WIDTH);

const scale = computed(() => displayWidth.value / PUZZLE_WIDTH);
const blockDisplaySize = computed(() => (captchaData.value?.pieceSize ?? 0) * scale.value);
const maxBlockOffset = computed(() => Math.max(displayWidth.value - blockDisplaySize.value, 0));

const progressWidth = computed(() => offsetX.value + HANDLE_SIZE);

const blockOffsetX = computed(() => {
  if (!captchaData.value || maxOffset.value <= 0) {
    return 0;
  }
  return getBlockOffsetX(offsetX.value, maxOffset.value, maxBlockOffset.value);
});

const blockOffsetY = computed(() => {
  if (!captchaData.value) {
    return 0;
  }
  return (captchaData.value.targetY - captchaData.value.pieceSize / 2) * scale.value;
});

let removeDragListeners: (() => void) | null = null;

const updateLayout = () => {
  displayWidth.value = imageRef.value?.clientWidth || PUZZLE_WIDTH;
  maxOffset.value = Math.max(displayWidth.value - HANDLE_SIZE, 0);
};

const resetSlider = () => {
  removeDragListeners?.();
  removeDragListeners = null;
  offsetX.value = 0;
  isDragging.value = false;
  isSuccess.value = false;
  isFail.value = false;
};

const refreshCaptcha = async () => {
  resetSlider();
  loading.value = true;
  try {
    captchaData.value = await createPuzzleCaptcha();
    await nextTick();
    updateLayout();
  } finally {
    loading.value = false;
  }
};

const handleClosed = () => {
  resetSlider();
  captchaData.value = null;
};

const onDragStart = (event: MouseEvent | TouchEvent) => {
  if (!captchaData.value || isSuccess.value || loading.value) {
    return;
  }

  isFail.value = false;
  updateLayout();
  isDragging.value = true;

  const startX = "touches" in event ? event.touches[0].clientX : event.clientX;
  const startOffset = offsetX.value;

  const onMove = (moveEvent: MouseEvent | TouchEvent) => {
    const clientX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
    offsetX.value = Math.min(Math.max(startOffset + clientX - startX, 0), maxOffset.value);
  };

  const onEnd = () => {
    isDragging.value = false;
    removeDragListeners?.();
    removeDragListeners = null;

    const data = captchaData.value;
    if (!data) {
      return;
    }

    const currentBlockOffset = getBlockOffsetX(offsetX.value, maxOffset.value, maxBlockOffset.value);
    if (verifyPuzzleOffset(currentBlockOffset, data.targetX, data.pieceSize, displayWidth.value)) {
      isSuccess.value = true;
      window.setTimeout(() => {
        emit("success", { offsetX: currentBlockOffset, targetX: data.targetX });
        visible.value = false;
      }, 450);
      return;
    }

    isFail.value = true;
    window.setTimeout(() => {
      offsetX.value = 0;
      isFail.value = false;
    }, 500);
  };

  removeDragListeners = () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("touchend", onEnd);
};

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      refreshCaptcha();
    }
  }
);

onMounted(() => {
  window.addEventListener("resize", updateLayout);
});

onUnmounted(() => {
  removeDragListeners?.();
  window.removeEventListener("resize", updateLayout);
});
</script>

<style lang="scss" scoped>
.cyber-verify {
  padding: 2px 0 0;
  color: #c8e6ff;
}

.cyber-verify-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.cyber-verify-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cyber-verify-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4a6080;
  box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4);
  transition: all 0.3s ease;

  &.active {
    background: #00d4ff;
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.8);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  &.success {
    background: #52ffa8;
    box-shadow: 0 0 10px rgba(82, 255, 168, 0.8);
    animation: none;
  }
}

.cyber-verify-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #e8f4ff;
  text-transform: uppercase;
}

.cyber-verify-subtitle {
  margin-top: 2px;
  font-size: 11px;
  color: rgba(136, 180, 220, 0.75);
  letter-spacing: 0.04em;
}

.cyber-verify-actions {
  display: flex;
  gap: 4px;
}

.cyber-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 6px;
  background: rgba(0, 212, 255, 0.06);
  color: rgba(160, 210, 255, 0.85);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    color: #00d4ff;
    border-color: rgba(0, 212, 255, 0.45);
    background: rgba(0, 212, 255, 0.12);
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.15);
  }
}

.cyber-verify-image {
  position: relative;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  background: #050a14;
  border: 1px solid rgba(0, 212, 255, 0.22);
  box-shadow:
    inset 0 0 30px rgba(0, 212, 255, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.45);

  &.dragging {
    border-color: rgba(0, 212, 255, 0.45);
    box-shadow:
      inset 0 0 40px rgba(0, 212, 255, 0.06),
      0 0 20px rgba(0, 212, 255, 0.12);
  }

  &.success {
    border-color: rgba(82, 255, 168, 0.55);
    box-shadow: 0 0 24px rgba(82, 255, 168, 0.15);
  }

  &.fail {
    animation: glitch-border 0.4s ease;
  }
}

.corner {
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 4;
  pointer-events: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: #00d4ff;
    box-shadow: 0 0 6px rgba(0, 212, 255, 0.8);
  }

  &::before {
    width: 14px;
    height: 2px;
  }

  &::after {
    width: 2px;
    height: 14px;
  }
}

.corner-tl {
  top: 6px;
  left: 6px;
}

.corner-tr {
  top: 6px;
  right: 6px;
  transform: rotate(90deg);
}

.corner-bl {
  bottom: 6px;
  left: 6px;
  transform: rotate(-90deg);
}

.corner-br {
  bottom: 6px;
  right: 6px;
  transform: rotate(180deg);
}

.cyber-bg {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
}

.cyber-block {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.55));
  will-change: transform;

  &.fail {
    animation: block-shake 0.4s ease;
    filter: drop-shadow(0 0 8px rgba(255, 77, 106, 0.65));
  }

  &.success {
    filter: drop-shadow(0 0 12px rgba(82, 255, 168, 0.75));
  }
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 3;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.15) 20%, rgba(0, 212, 255, 0.85) 50%, rgba(0, 212, 255, 0.15) 80%, transparent);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.6);
  animation: scan 2.8s linear infinite;
  pointer-events: none;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px);
  background-size: 16px 16px;
  pointer-events: none;
}

.cyber-loading {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(5, 10, 20, 0.82);
  backdrop-filter: blur(4px);
  color: rgba(160, 210, 255, 0.9);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.cyber-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(0, 212, 255, 0.15);
  border-top-color: #00d4ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.25);
}

.status-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 6;
  transform: translate(-50%, -50%);
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;

  &.success {
    color: #52ffa8;
    background: rgba(82, 255, 168, 0.12);
    border: 1px solid rgba(82, 255, 168, 0.45);
    box-shadow: 0 0 20px rgba(82, 255, 168, 0.2);
  }

  &.fail {
    color: #ff6b8a;
    background: rgba(255, 77, 106, 0.12);
    border: 1px solid rgba(255, 77, 106, 0.45);
    box-shadow: 0 0 20px rgba(255, 77, 106, 0.2);
  }
}

.status-fade-enter-active,
.status-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.status-fade-enter-from,
.status-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.92);
}

.cyber-verify-track {
  position: relative;
  height: 44px;
  margin: 16px auto 0;
  border-radius: 8px;
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid rgba(0, 212, 255, 0.18);
  overflow: hidden;
  user-select: none;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(0, 212, 255, 0.06) 0,
      rgba(0, 212, 255, 0.06) 1px,
      transparent 1px,
      transparent 12px
    );
    pointer-events: none;
  }

  &.dragging {
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 0 16px rgba(0, 212, 255, 0.1);
  }

  &.success {
    border-color: rgba(82, 255, 168, 0.45);
    background: rgba(82, 255, 168, 0.06);
  }

  &.fail {
    animation: shake 0.4s ease;
    border-color: rgba(255, 77, 106, 0.45);
  }
}

.cyber-verify-tip {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(136, 180, 220, 0.75);
  font-size: 12px;
  letter-spacing: 0.06em;
  pointer-events: none;
  z-index: 1;

  &.success {
    color: #52ffa8;
  }
}

.cyber-verify-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.08), rgba(0, 212, 255, 0.22));
  pointer-events: none;
  overflow: hidden;

  .progress-glow {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.35));
  }
}

.cyber-verify-handle {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4ff;
  background: linear-gradient(145deg, #0d1f35, #091525);
  border-right: 1px solid rgba(0, 212, 255, 0.35);
  box-shadow:
    0 0 16px rgba(0, 212, 255, 0.2),
    inset 0 0 12px rgba(0, 212, 255, 0.08);
  cursor: grab;
  transition: box-shadow 0.2s ease;

  &.dragging {
    cursor: grabbing;
    box-shadow:
      0 0 24px rgba(0, 212, 255, 0.35),
      inset 0 0 16px rgba(0, 212, 255, 0.12);
  }

  &.success {
    color: #52ffa8;
    border-color: rgba(82, 255, 168, 0.45);
    box-shadow: 0 0 20px rgba(82, 255, 168, 0.25);
  }

  &.fail {
    color: #ff6b8a;
    border-color: rgba(255, 77, 106, 0.45);
    box-shadow: 0 0 20px rgba(255, 77, 106, 0.25);
  }
}

.cyber-verify-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgba(100, 140, 180, 0.65);
}

.footer-tag {
  color: rgba(0, 212, 255, 0.55);
  font-weight: 600;
}

.footer-divider {
  width: 1px;
  height: 10px;
  background: rgba(0, 212, 255, 0.2);
}

.footer-status {
  flex: 1;
  text-align: right;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.8);
  }
  50% {
    box-shadow: 0 0 16px rgba(0, 212, 255, 1);
  }
}

@keyframes scan {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@keyframes block-shake {
  0%,
  100% {
    margin-left: 0;
  }
  25% {
    margin-left: -5px;
  }
  75% {
    margin-left: 5px;
  }
}

@keyframes glitch-border {
  0%,
  100% {
    border-color: rgba(255, 77, 106, 0.45);
  }
  50% {
    border-color: rgba(255, 77, 106, 0.85);
    box-shadow: 0 0 20px rgba(255, 77, 106, 0.25);
  }
}
</style>

<style lang="scss">
.cyber-verify-dialog {
  .ant-modal-content {
    background: linear-gradient(160deg, #0a1422 0%, #060d18 100%);
    border: 1px solid rgba(0, 212, 255, 0.18);
    border-radius: 12px;
    box-shadow:
      0 24px 64px rgba(0, 0, 0, 0.55),
      0 0 40px rgba(0, 212, 255, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .ant-modal-header {
    display: none;
  }

  .ant-modal-body {
    padding: 18px 18px 16px;
  }

  .ant-modal-close {
    display: none;
  }
}
</style>
