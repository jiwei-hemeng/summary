<template>
  <div v-click-outside="closeDropdown" class="custom-select" :class="{ 'is-disabled': disabled }">
    <!-- 选择框主体 -->
    <div class="select-trigger" @click="toggleDropdown">
      <div class="select-display">
        <template v-if="multiple">
          <!-- 多选模式：显示标签组 -->
          <div class="select-tags">
            <span v-for="item in selectedItems" :key="getOptionValue(item)" class="select-tag">
              <slot name="option-label" :option="item">
                {{ getOptionLabel(item) }}
              </slot>
              <span class="select-tag-close" @click.stop="removeItem(item)">×</span>
            </span>
            <input
              ref="searchInput"
              v-model="searchQuery"
              :disabled="disabled"
              class="select-search-input"
              :placeholder="selectedItems.length ? '' : placeholder"
              @input="handleSearch"
              @focus="handleInputFocus"
              @keydown="handleKeydown"
            />
          </div>
        </template>
        <template v-else>
          <!-- 单选模式：显示当前选中的项 -->
          <span v-if="selectedItem" class="select-single-value">
            <slot name="option-label" :option="selectedItem">
              {{ getOptionLabel(selectedItem) }}
            </slot>
          </span>
          <span v-else class="select-placeholder">{{ placeholder }}</span>
          <input
            v-if="remote && !multiple"
            ref="searchInput"
            v-model="searchQuery"
            :disabled="disabled"
            class="select-remote-input"
            :placeholder="selectedItem ? '' : placeholder"
            @input="handleSearch"
            @focus="handleInputFocus"
            @keydown="handleKeydown"
          />
        </template>
      </div>
      <div class="select-icons">
        <span
          v-if="clearable && (selectedItems.length || selectedItem)"
          class="select-clear-icon"
          @click.stop="clearSelection"
          >×</span
        >
        <span class="select-arrow-icon" :class="{ 'is-open': dropdownOpen }">▼</span>
      </div>
    </div>

    <!-- 下拉选项面板 -->
    <transition name="dropdown-fade">
      <div v-show="dropdownOpen" ref="dropdown" class="select-dropdown">
        <div v-if="loading" class="select-loading">加载中...</div>
        <div v-else-if="filteredOptions.length === 0" class="select-empty">暂无数据</div>
        <ul v-else class="select-options">
          <li
            v-for="option in filteredOptions"
            :key="getOptionValue(option)"
            class="select-option"
            :class="{ 'is-selected': isSelected(option), 'is-disabled-option': option.disabled }"
            @click="selectOption(option)"
          >
            <slot name="option" :option="option" :selected="isSelected(option)">
              <div class="default-option">
                <span class="option-label">
                  <slot name="option-label" :option="option">
                    {{ getOptionLabel(option) }}
                  </slot>
                </span>
                <span v-if="multiple && isSelected(option)" class="option-check">✓</span>
              </div>
            </slot>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
// 点击外部指令
const clickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  }
};

export default {
  name: "CustomSelect",
  directives: {
    clickOutside
  },
  props: {
    // 选项列表
    options: {
      type: Array,
      default: () => []
    },
    // 选中的值 (单选: 值或对象, 多选: 数组)
    modelValue: {
      type: [Object, Array, String, Number],
      default: null
    },
    // 占位符
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否远程搜索
    remote: {
      type: Boolean,
      default: false
    },
    // 远程搜索方法，返回Promise
    remoteMethod: {
      type: Function,
      default: null
    },
    // 选项value的字段名
    valueKey: {
      type: String,
      default: "value"
    },
    // 选项label的字段名
    labelKey: {
      type: String,
      default: "label"
    },
    // 是否在输入时立即搜索
    filterable: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:modelValue", "change", "search"],
  data() {
    return {
      dropdownOpen: false,
      searchQuery: "",
      loading: false,
      // 内部维护的选中项 (多选用数组，单选用对象)
      selectedItems: [], // 多选
      selectedItem: null // 单选
    };
  },
  computed: {
    // 过滤后的选项 (本地过滤)
    filteredOptions() {
      if (!this.filterable || !this.searchQuery.trim() || this.remote) {
        return this.options;
      }
      const query = this.searchQuery.trim().toLowerCase();
      return this.options.filter((opt) => this.getOptionLabel(opt).toLowerCase().includes(query));
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        this.updateInternalSelection(val);
      }
    },
    multiple: {
      handler() {
        this.updateInternalSelection(this.modelValue);
      }
    },
    options: {
      deep: true,
      handler() {
        this.updateInternalSelection(this.modelValue);
      }
    }
  },
  methods: {
    // 更新内部选中状态
    updateInternalSelection(val) {
      if (this.multiple) {
        if (Array.isArray(val)) {
          this.selectedItems = [...val];
        } else if (val) {
          this.selectedItems = [val];
        } else {
          this.selectedItems = [];
        }
        // 确保selectedItems中的项在options中存在引用或值匹配
        if (this.options.length) {
          this.selectedItems = this.selectedItems
            .map((item) => {
              const found = this.options.find(
                (opt) => this.getOptionValue(opt) === this.getOptionValue(item)
              );
              return found || item;
            })
            .filter((item) => item);
        }
      } else {
        if (val && typeof val === "object") {
          this.selectedItem = val;
        } else if (val !== undefined && val !== null) {
          const found = this.options.find((opt) => this.getOptionValue(opt) === val);
          this.selectedItem = found || null;
        } else {
          this.selectedItem = null;
        }
      }
    },

    // 获取选项的值
    getOptionValue(option) {
      if (!option) return null;
      if (typeof option === "object") {
        return option[this.valueKey];
      }
      return option;
    },

    // 获取选项的显示标签
    getOptionLabel(option) {
      if (!option) return "";
      if (typeof option === "object") {
        return option[this.labelKey];
      }
      return String(option);
    },

    // 判断选项是否被选中
    isSelected(option) {
      if (this.multiple) {
        return this.selectedItems.some(
          (item) => this.getOptionValue(item) === this.getOptionValue(option)
        );
      } else {
        return (
          this.selectedItem &&
          this.getOptionValue(this.selectedItem) === this.getOptionValue(option)
        );
      }
    },

    // 切换下拉框
    toggleDropdown() {
      if (this.disabled) return;
      if (this.dropdownOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    },

    openDropdown() {
      this.dropdownOpen = true;
      if (this.remote && this.searchQuery === "") {
        // 远程模式打开时触发一次空搜索
        this.handleSearch();
      }
      // 聚焦输入框
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      });
    },

    closeDropdown() {
      this.dropdownOpen = false;
      // 关闭时不清空搜索词，保留可能用于远程搜索
    },

    // 处理搜索输入
    handleSearch() {
      if (this.remote && this.remoteMethod) {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
          this.loading = true;
          this.remoteMethod(this.searchQuery)
            .then(() => {
              this.loading = false;
              // 注意：远程结果由父组件通过props更新options
              this.$emit("search", this.searchQuery);
            })
            .catch(() => {
              this.loading = false;
            });
        }, 300);
      } else {
        this.$emit("search", this.searchQuery);
      }
    },

    handleInputFocus() {
      if (!this.dropdownOpen) {
        this.openDropdown();
      }
    },

    // 选择选项
    selectOption(option) {
      if (option.disabled) return;

      if (this.multiple) {
        const index = this.selectedItems.findIndex(
          (item) => this.getOptionValue(item) === this.getOptionValue(option)
        );
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        } else {
          this.selectedItems.push(option);
        }
        this.emitChange();
        // 多选模式下不清空搜索，继续搜索
        this.searchQuery = "";
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
        });
      } else {
        this.selectedItem = option;
        this.emitChange();
        this.closeDropdown();
        this.searchQuery = "";
      }
    },

    // 移除已选项 (多选)
    removeItem(item) {
      if (this.disabled) return;
      const index = this.selectedItems.findIndex(
        (i) => this.getOptionValue(i) === this.getOptionValue(item)
      );
      if (index > -1) {
        this.selectedItems.splice(index, 1);
        this.emitChange();
      }
    },

    // 清空所有选中
    clearSelection() {
      if (this.disabled) return;
      if (this.multiple) {
        this.selectedItems = [];
      } else {
        this.selectedItem = null;
      }
      this.emitChange();
      if (this.remote) {
        this.searchQuery = "";
        this.handleSearch();
      }
    },

    // 发送更改事件
    emitChange() {
      let emitValue;
      if (this.multiple) {
        emitValue = [...this.selectedItems];
      } else {
        emitValue = this.selectedItem ? this.getOptionValue(this.selectedItem) : null;
      }
      this.$emit("update:modelValue", emitValue);
      this.$emit("change", emitValue);
    },

    // 键盘事件处理
    handleKeydown(e) {
      if (e.key === "Escape") {
        this.closeDropdown();
      } else if (e.key === "Enter" && this.filteredOptions.length) {
        this.selectOption(this.filteredOptions[0]);
      }
    }
  },
  beforeUnmount() {
    clearTimeout(this.searchTimer);
  }
};
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  width: 240px;
  font-size: 14px;
  user-select: none;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  padding: 4px 8px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-select.is-disabled .select-trigger {
  background-color: #f5f7fa;
  cursor: not-allowed;
  color: #c0c4cc;
}

.select-trigger:hover:not(.is-disabled) {
  border-color: #409eff;
}

.select-display {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.select-placeholder {
  color: #c0c4cc;
}

.select-single-value {
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多选标签 */
.select-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.select-tag {
  display: inline-flex;
  align-items: center;
  background-color: #f4f4f5;
  border-radius: 4px;
  padding: 0 4px 0 8px;
  font-size: 12px;
  color: #606266;
  height: 24px;
  line-height: 24px;
}

.select-tag-close {
  margin-left: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #909399;
}

.select-tag-close:hover {
  color: #409eff;
}

/* 搜索输入框 */
.select-search-input,
.select-remote-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 40px;
  background: transparent;
  font-size: 14px;
  padding: 0;
  margin: 0;
}

.select-remote-input {
  width: 100%;
}

/* 图标区域 */
.select-icons {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.select-clear-icon {
  cursor: pointer;
  color: #c0c4cc;
  font-size: 16px;
  font-weight: bold;
}

.select-clear-icon:hover {
  color: #909399;
}

.select-arrow-icon {
  font-size: 12px;
  color: #c0c4cc;
  transition: transform 0.2s;
}

.select-arrow-icon.is-open {
  transform: rotate(180deg);
}

/* 下拉面板 */
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}

.select-loading,
.select-empty {
  padding: 10px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.select-options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: background 0.2s;
}

.select-option:hover {
  background-color: #f5f7fa;
}

.select-option.is-selected {
  background-color: #ecf5ff;
  color: #409eff;
}

.select-option.is-disabled-option {
  cursor: not-allowed;
  color: #c0c4cc;
}

.default-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-check {
  color: #409eff;
  font-weight: bold;
}
</style>
