<template>
  <a-modal
    v-model:open="visible"
    width="340px"
    centered
    :footer="null"
    :closable="false"
    :mask-closable="false"
    wrap-class-name="puzzle-verify-dialog"
    @after-close="handleClosed"
  >
    <div class="puzzle-verify">
      <div class="puzzle-verify-toolbar">
        <button type="button" class="puzzle-verify-refresh" @click="refreshCaptcha">
          <ReloadOutlined />
          <span>{{ refreshText }}</span>
        </button>
        <button type="button" class="puzzle-verify-close" aria-label="close" @click="visible = false">
          <CloseOutlined />
        </button>
      </div>

      <div ref="imageRef" class="puzzle-verify-image" :style="{ width: `${PUZZLE_WIDTH}px`, maxWidth: '100%', height: `${PUZZLE_HEIGHT}px` }">
        <img v-if="captchaData" :src="captchaData.bgImage" class="puzzle-bg" :width="PUZZLE_WIDTH" :height="PUZZLE_HEIGHT" alt="captcha background" />
        <img
          v-if="captchaData"
          :src="captchaData.blockImage"
          class="puzzle-block"
          :class="{ fail: isFail, success: isSuccess }"
          :style="{
            width: `${blockDisplaySize}px`,
            height: `${blockDisplaySize}px`,
            transform: `translate(${blockOffsetX}px, ${blockOffsetY}px)`
          }"
          alt="captcha block"
        />
        <div v-if="loading" class="puzzle-loading">{{ loadingText }}</div>
      </div>

      <div
        ref="trackRef"
        class="puzzle-verify-track"
        :style="{ width: `${PUZZLE_WIDTH}px`, maxWidth: '100%' }"
        :class="{ success: isSuccess, fail: isFail }"
      >
        <span v-show="!isSuccess && !isDragging" class="puzzle-verify-tip">{{ tipText }}</span>
        <span v-show="isSuccess" class="puzzle-verify-tip success-text">{{ successText }}</span>
        <div class="puzzle-verify-progress" :style="{ width: `${progressWidth}px` }" />
        <div
          class="puzzle-verify-handle"
          :class="{ dragging: isDragging, success: isSuccess, fail: isFail }"
          :style="{ transform: `translateX(${offsetX}px)` }"
          @mousedown="onDragStart"
          @touchstart.prevent="onDragStart"
        >
          <CheckOutlined v-if="isSuccess" />
          <DoubleRightOutlined v-else />
        </div>
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

const refreshText = computed(() => t("slideVerify.refresh"));
const tipText = computed(() => t("slideVerify.tip"));
const successText = computed(() => t("slideVerify.success"));
const loadingText = computed(() => t("slideVerify.loading"));

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
      }, 350);
      return;
    }

    isFail.value = true;
    window.setTimeout(() => {
      offsetX.value = 0;
      isFail.value = false;
    }, 450);
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
.puzzle-verify {
  padding: 0 2px 4px;
}

.puzzle-verify-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.puzzle-verify-refresh {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #177ffe;
  }
}

.puzzle-verify-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #909399;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #303133;
  }
}

.puzzle-verify-image {
  position: relative;
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
  background: #eef2f6;
}

.puzzle-bg {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
}

.puzzle-block {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.28));
  will-change: transform;

  &.fail {
    animation: block-shake 0.35s ease;
  }
}

.puzzle-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
  color: #606266;
  font-size: 13px;
}

.puzzle-verify-track {
  position: relative;
  height: 44px;
  margin: 14px auto 0;
  border-radius: 4px;
  background: #f2f4f7;
  border: 1px solid #e4eaf0;
  overflow: hidden;
  user-select: none;

  &.success {
    border-color: #95de64;
    background: #f6ffed;
  }

  &.fail {
    animation: shake 0.35s ease;
  }
}

.puzzle-verify-tip {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a96a8;
  font-size: 13px;
  pointer-events: none;
  z-index: 1;

  &.success-text {
    color: #52c41a;
  }
}

.puzzle-verify-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #d6ebff;
  pointer-events: none;
}

.puzzle-verify-handle {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #177ffe;
  background: #fff;
  border-right: 1px solid #e4eaf0;
  box-shadow: 0 2px 8px rgba(23, 127, 254, 0.18);
  cursor: grab;

  &.dragging {
    cursor: grabbing;
  }

  &.success {
    color: #52c41a;
  }

  &.fail {
    color: #f56c6c;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

@keyframes block-shake {
  0%,
  100% {
    margin-left: 0;
  }
  25% {
    margin-left: -4px;
  }
  75% {
    margin-left: 4px;
  }
}
</style>

<style lang="scss">
.puzzle-verify-dialog {
  .ant-modal-header {
    display: none;
  }

  .ant-modal-body {
    padding: 16px 16px 18px;
  }
}
</style>
