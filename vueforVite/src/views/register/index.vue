<!--
  标题：         login.vue
  功能：         注册页
  说明：
  当前版本：     1.0
  创建信息：     Created by 纪计伟 2026-06-30
  修改记录：
  修改人：        纪计伟
    -  2026-06-30：添加滑块验证码代码调整
 -->
<template>
  <div class="register">
    <button type="button" class="back-btn" aria-label="返回登录" @click="handleBackLogin">
      <ArrowLeftOutlined />
    </button>

    <div class="register-container">
      <div class="title">注册</div>

      <a-form
        ref="registerRef"
        :model="registerForm"
        :rules="registerRules"
        :label-col="{ style: { width: '96px' } }"
        label-align="right"
        class="register-form"
      >
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="registerForm.phone" type="text" size="large" autocomplete="off" placeholder="请输入手机号" />
        </a-form-item>

        <a-form-item label="验证码" name="smsCode">
          <div class="code-row">
            <a-input v-model:value="registerForm.smsCode" type="text" size="large" autocomplete="off" placeholder="请输入验证码" class="code-input" />
            <a-button class="send-code-btn" size="large" :disabled="sendCodeDisabled" @click="handleSendCode">
              {{ sendCodeText }}
            </a-button>
          </div>
        </a-form-item>

        <a-form-item label="账号名称" name="username">
          <a-input v-model:value="registerForm.username" type="text" size="large" autocomplete="off" placeholder="请输入账号名称" />
        </a-form-item>

        <a-form-item label="设置密码" name="password">
          <a-input-password
            v-model:value="registerForm.password"
            size="large"
            autocomplete="off"
            placeholder="请输入至少8位密码，需包含大小写、数字与符号"
            @keyup.enter="handleRegister"
          />
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password
            v-model:value="registerForm.confirmPassword"
            size="large"
            autocomplete="off"
            placeholder="请输入确认密码"
            @keyup.enter="handleRegister"
          />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="registerForm.email" type="text" size="large" autocomplete="off" placeholder="请输入邮箱" />
        </a-form-item>

        <a-form-item class="submit-item">
          <a-button :loading="loading" size="large" type="primary" class="submit-btn" @click.prevent="handleRegister">
            <span v-if="!loading">注册</span>
            <span v-else>注册中...</span>
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <SlideVerify v-model="showSlideVerify" @success="handleSlideVerifySuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount } from "vue";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue/es/form";
import type { Rule } from "ant-design-vue/es/form";
import { useRouter } from "vue-router";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import SlideVerify from "@/components/SlideVerify/index.vue";

const router = useRouter();
const loading = ref(false);
const registerRef = ref<FormInstance>();
const showSlideVerify = ref(false);
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const registerForm = reactive({
  phone: "",
  smsCode: "",
  username: "",
  password: "",
  confirmPassword: "",
  email: ""
});

const registerRules: Record<string, Rule[]> = {
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
  ],
  smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  username: [
    { required: true, message: "请输入账号名称", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_]+$/, message: "账号名称不能包含中文和特殊字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请设置密码", trigger: "blur" },
    { min: 8, message: "密码至少8位", trigger: "blur" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      message: "密码必须包含大小写字母、数字和特殊符号",
      trigger: "blur"
    }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: async (_rule, value) => {
        if (value !== registerForm.password) {
          return Promise.reject(new Error("两次输入的密码不一致"));
        }
      },
      trigger: "blur"
    }
  ],
  email: [
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "请输入正确的邮箱格式",
      trigger: "blur"
    }
  ]
};

const sendCodeDisabled = computed(() => countdown.value > 0);
const sendCodeText = computed(() => (countdown.value > 0 ? `${countdown.value}s` : "发送验证码"));

const handleBackLogin = () => {
  router.push("/login");
};

const startCountdown = () => {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
};

const handleSendCode = () => {
  if (!registerForm.phone) {
    message.warning("请先输入手机号");
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    message.warning("请输入正确的手机号格式");
    return;
  }
  if (countdown.value > 0) {
    return;
  }

  showSlideVerify.value = true;
};

const handleSlideVerifySuccess = () => {
  // TODO: 调用发送验证码接口
  message.success("验证码已发送");
  startCountdown();
};

const handleRegister = async () => {
  try {
    await registerRef.value?.validate();
    loading.value = true;
    try {
      // TODO: 调用注册接口
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("注册成功！即将跳转到登录页");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      message.error("注册失败，请稍后重试");
    } finally {
      loading.value = false;
    }
  } catch {
    // validation failed
  }
};

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style lang="scss" scoped>
.register {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 80px 24px 48px;
  background: #ffffff;
}

.back-btn {
  position: absolute;
  top: 32px;
  left: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px dashed #c5d3e0;
  border-radius: 6px;
  background: transparent;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #177ffe;
    border-color: #177ffe;
  }
}

.register-container {
  width: 100%;
  max-width: 640px;
}

.title {
  margin: 0 0 40px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  line-height: 33px;
}

.register-form {
  :deep(.ant-form-item) {
    margin-bottom: 24px;
  }

  :deep(.ant-form-item-label > label) {
    color: #262626;
    font-size: 14px;
    height: 46px;
  }

  :deep(.ant-form-item-control-input-content) {
    line-height: 46px;
  }

  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input) {
    height: 46px;
  }
}

.register-form :deep(.ant-input-affix-wrapper),
.register-form :deep(.ant-input) {
  background-color: #f0f4f8;
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #e4eaf0;
}

.register-form :deep(.ant-input-affix-wrapper-focused),
.register-form :deep(.ant-input:focus) {
  border-color: rgba(23, 127, 254, 0.4);
  box-shadow: 0 0 0 2px rgba(23, 127, 254, 0.1);
}

.code-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.code-input {
  flex: 1;
  min-width: 0;
}

.send-code-btn {
  flex-shrink: 0;
  min-width: 112px;
  height: 46px;
  padding: 0 16px;
  border: 1px solid #e4eaf0;
  border-radius: 8px;
  background: #f0f4f8;
  color: #595959;
  font-size: 14px;

  &:hover:not(:disabled) {
    color: #177ffe;
    border-color: rgba(23, 127, 254, 0.35);
    background: #eef5ff;
  }

  &:disabled {
    color: #bfbfbf;
    background: #f5f5f5;
  }
}

.submit-item {
  margin-top: 8px;
  margin-bottom: 0 !important;

  :deep(.ant-form-item-control-input-content) {
    margin-left: 96px;
  }
}

.submit-btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 2px;
  background: #177ffe;
  box-shadow: 0 6px 16px rgba(23, 127, 254, 0.3);

  &:hover,
  &:focus {
    background: #4096ff;
  }
}

@media (max-width: 640px) {
  .back-btn {
    top: 20px;
    left: 20px;
  }

  .register-form {
    :deep(.ant-form-item) {
      flex-direction: column;
    }

    :deep(.ant-form-item-label > label) {
      justify-content: flex-start;
      height: 32px;
    }

    :deep(.ant-form-item-control-input-content) {
      margin-left: 0 !important;
    }
  }

  .submit-item :deep(.ant-form-item-control-input-content) {
    margin-left: 0 !important;
  }
}
</style>
