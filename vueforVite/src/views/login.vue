<!--
  标题：         login.vue
  功能：         登录页页
  说明：
  当前版本：     1.0
  创建信息：     Created by 纪计伟 2026-06-29
  修改记录：
  修改人：        纪计伟
    -  2026-06-30：添加滑块验证码代码调整
 -->
<template>
  <div class="login">
    <div class="login-left">
      <div class="login-logo">
        <img v-if="logoTitle" :src="logoTitle" class="login-logo-img" alt="logo" />
      </div>
      <div class="login-illustration"></div>
    </div>

    <div class="login-right">
      <div class="login-panel">
        <div class="login-header">
          <h3 class="title">{{ title }}</h3>

          <div class="login-tabs">
            <button type="button" class="login-tab" :class="{ active: loginMode === 'account' }" @click="loginMode = 'account'">
              {{ proxy.$t('login.accountLogin') }}
            </button>
            <button type="button" class="login-tab" :class="{ active: loginMode === 'phone' }" @click="loginMode = 'phone'">
              {{ proxy.$t('login.phoneLogin') }}
            </button>
          </div>
        </div>

        <div class="login-form-area">
          <a-form v-show="loginMode === 'account'" ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <a-form-item name="username">
              <a-input v-model:value="loginForm.username" type="text" size="large" autocomplete="off" :placeholder="proxy.$t('login.username')">
                <template #prefix><svg-icon icon-class="login-user" class="input-icon" /></template>
              </a-input>
            </a-form-item>

            <a-form-item name="password">
              <a-input-password
                v-model:value="loginForm.password"
                size="large"
                autocomplete="off"
                :placeholder="proxy.$t('login.password')"
                @keyup.enter="handleLoginClick"
              >
                <template #prefix><svg-icon icon-class="login-password" class="input-icon" /></template>
              </a-input-password>
            </a-form-item>
            <a-form-item class="login-btn-item">
              <a-button :loading="loading" size="large" type="primary" class="login-btn" @click.prevent="handleLoginClick">
                <span v-if="!loading">{{ proxy.$t('login.login') }}</span>
                <span v-else>{{ proxy.$t('login.logging') }}</span>
              </a-button>
            </a-form-item>
          </a-form>

          <a-form v-show="loginMode === 'phone'" ref="phoneLoginRef" :model="phoneForm" :rules="phoneRules" class="login-form">
            <a-form-item name="phone">
              <a-input v-model:value="phoneForm.phone" type="text" size="large" autocomplete="off" maxlength="11" :placeholder="proxy.$t('login.phone')">
                <template #prefix><svg-icon icon-class="login-user" class="input-icon" /></template>
              </a-input>
            </a-form-item>
            <a-form-item name="smsCode">
              <a-input
                v-model:value="phoneForm.smsCode"
                size="large"
                autocomplete="off"
                :placeholder="proxy.$t('login.smsCode')"
                class="login-code-input"
                @keyup.enter="handlePhoneLogin"
              >
                <template #prefix><svg-icon icon-class="login-code" class="input-icon" /></template>
              </a-input>
              <a-button class="send-code-btn" size="large" :disabled="sendCodeDisabled" @click="handleSendCode">
                {{ sendCodeText }}
              </a-button>
            </a-form-item>
            <a-form-item class="login-btn-item">
              <a-button :loading="phoneLoading" size="large" type="primary" class="login-btn" @click.prevent="handlePhoneLogin">
                <span v-if="!phoneLoading">{{ proxy.$t('login.login') }}</span>
                <span v-else>{{ proxy.$t('login.logging') }}</span>
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <div class="login-actions">
          <router-link to="/register" class="login-link">{{ proxy.$t('login.registerNow') }}</router-link>
          <a class="login-link" href="javascript:void(0)" @click.prevent="handleForgotPassword">
            {{ proxy.$t('login.forgotPassword') }}
          </a>
        </div>

        <p class="login-agreement">
          {{ proxy.$t('login.agreementPrefix') }}
          <a class="login-link" href="javascript:void(0)" @click.prevent="handleAgreement">
            {{ proxy.$t('login.userAgreement') }}
          </a>
        </p>
      </div>
    </div>

    <SlideVerify v-model="slideVerifyVisible" @success="onSlideVerifySuccess" />
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue/es/form';
import type { Rule } from 'ant-design-vue/es/form';
import { getCodeImg, getTenantList } from '@/api/login';
import { authRouterUrl } from '@/api/system/social/auth';
import { useUserStore } from '@/store/modules/user';
import { LoginData, TenantVO } from '@/api/types';
import { to } from 'await-to-js';
import { HttpStatus } from '@/enums/RespEnum';
import { useI18n } from 'vue-i18n';
import { resolvePostLoginPath } from '@/utils/menu';
import logoTitle from '@/assets/logo/logoTitle.png';
import SlideVerify from '@/components/SlideVerify/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const title = import.meta.env.VITE_APP_TITLE;
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const loginMode = ref<'account' | 'phone'>('account');

const loginForm = ref<LoginData>({
  tenantId: '000000',
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const loginRules: Record<string, Rule[]> = {
  tenantId: [{ required: true, trigger: 'blur', message: t('login.rule.tenantId.required') }],
  username: [{ required: true, trigger: 'blur', message: t('login.rule.username.required') }],
  password: [{ required: true, trigger: 'blur', message: t('login.rule.password.required') }]
};

const phoneForm = ref({
  phone: '',
  smsCode: ''
});

const phoneRules: Record<string, Rule[]> = {
  phone: [
    { required: true, trigger: 'blur', message: t('login.rule.phone.required') },
    { pattern: /^1[3-9]\d{9}$/, trigger: 'blur', message: t('login.rule.phone.pattern') }
  ],
  smsCode: [{ required: true, trigger: 'blur', message: t('login.rule.smsCode.required') }]
};

const captchaEnabled = ref(true);
const tenantEnabled = ref(true);

const redirect = ref<string>();
const loginRef = ref<FormInstance>();
const phoneLoginRef = ref<FormInstance>();
const tenantList = ref<TenantVO[]>([]);
const phoneLoading = ref(false);
const countdown = ref(0);
const slideVerifyVisible = ref(false);
const slideVerifyMode = ref<'login' | 'sms'>('sms');
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const sendCodeDisabled = computed(() => countdown.value > 0);
const sendCodeText = computed(() => (countdown.value > 0 ? `${countdown.value}s` : t('login.sendCode')));

watch(
  () => router.currentRoute.value,
  (newRoute: any) => {
    const queryRedirect = newRoute.query?.redirect;
    redirect.value = queryRedirect ? decodeURIComponent(String(queryRedirect)) : undefined;
  },
  { immediate: true }
);

const handleLoginClick = async () => {
  try {
    await loginRef.value?.validate();
    if (captchaEnabled.value) {
      slideVerifyMode.value = 'login';
      slideVerifyVisible.value = true;
      return;
    }
    await doLogin();
  } catch (fields) {
    console.log('error submit!', fields);
  }
};

const doLogin = async () => {
  loading.value = true;
  if (loginForm.value.rememberMe) {
    localStorage.setItem('tenantId', String(loginForm.value.tenantId));
    localStorage.setItem('username', String(loginForm.value.username));
    localStorage.setItem('password', String(loginForm.value.password));
    localStorage.setItem('rememberMe', String(loginForm.value.rememberMe));
  } else {
    localStorage.removeItem('tenantId');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('rememberMe');
  }
  const [err] = await to(userStore.login(loginForm.value));
  if (!err) {
    const redirectUrl = await resolvePostLoginPath(redirect.value);
    await router.push(redirectUrl);
    loading.value = false;
  } else {
    loading.value = false;
  }
};

const initCaptchaConfig = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
};

const getLoginData = () => {
  const tenantId = localStorage.getItem('tenantId');
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const rememberMe = localStorage.getItem('rememberMe');
  loginForm.value = {
    tenantId: tenantId === null ? String(loginForm.value.tenantId) : tenantId,
    username: username === null ? String(loginForm.value.username) : username,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === null ? false : Boolean(rememberMe),
    code: loginForm.value.code,
    uuid: loginForm.value.uuid
  } as LoginData;
};

const initTenantList = async () => {
  const { data } = await getTenantList(false);
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
    if (tenantList.value != null && tenantList.value.length !== 0) {
      loginForm.value.tenantId = tenantList.value[0].tenantId;
    }
  }
};

const handleForgotPassword = () => {
  message.info(t('login.forgotPasswordTip'));
};

const handleAgreement = () => {
  message.info(t('login.agreementTip'));
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

const handleSendCode = async () => {
  if (!phoneForm.value.phone) {
    message.warning(t('login.rule.phone.required'));
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(phoneForm.value.phone)) {
    message.warning(t('login.rule.phone.pattern'));
    return;
  }
  if (countdown.value > 0) {
    return;
  }

  slideVerifyMode.value = 'sms';
  slideVerifyVisible.value = true;
};

const onSlideVerifySuccess = async () => {
  if (slideVerifyMode.value === 'login') {
    await doLogin();
    return;
  }
  // TODO: 调用发送验证码接口，可携带滑块验证结果
  message.success(t('login.sendCodeSuccess'));
  startCountdown();
};

const handlePhoneLogin = async () => {
  try {
    await phoneLoginRef.value?.validate();
    phoneLoading.value = true;
    try {
      // TODO: 调用手机验证码登录接口
      message.info(t('login.phoneLoginTip'));
    } finally {
      phoneLoading.value = false;
    }
  } catch {
    // validation failed
  }
};

onMounted(() => {
  initCaptchaConfig();
  initTenantList();
  getLoginData();
});

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.login-left {
  position: relative;
  flex: 0 0 65%;
  min-width: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #e9f5fc 0%, #d8ecfa 48%, #ebf6fd 100%);
}

.login-logo {
  position: relative;
  z-index: 2;
  padding: 36px 48px 0;
}

.login-logo-img {
  max-height: 44px;
  max-width: 200px;
  object-fit: contain;
}

.login-illustration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: url('@/assets/images/login-illustration.png') no-repeat left center;
  background-size: cover;
}

.login-right {
  flex: 0 0 35%;
  min-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.login-panel {
  width: 100%;
  max-width: 340px;
  height: 475px;
}

.login-header {
  flex-shrink: 0;
}

.title {
  margin: 0 0 32px;
  height: 33px;
  line-height: 33px;
  text-align: center;
  white-space: nowrap;
  font-family:
    Alibaba PuHuiTi 3,
    Alibaba PuHuiTi 30;
  font-weight: normal;
  font-size: 24px;
  color: #262626;
  font-style: normal;
  text-transform: none;
}

.login-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  margin-bottom: 28px;
  font-family:
    Alibaba PuHuiTi 3,
    Alibaba PuHuiTi 30;
  font-weight: normal;
  font-size: 20px;
  line-height: 27px;
  font-style: normal;
  text-transform: none;
}

.login-tab {
  flex: 1;
  border: none;
  background: transparent;
  color: #999999;
  font-size: 14px;
  line-height: 38px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    color: #177ffe;
    font-weight: 500;
    background: transparent;
  }

  &:not(.active) {
    background: #f2f2f2;
    color: #8a96a8;
  }
}

.login-form-area {
  flex-shrink: 0;
}

.login-form {
  :deep(.ant-form-item) {
    margin-bottom: 20px;
  }

  :deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input) {
    height: 46px;
  }

  :deep(.ant-input) {
    height: 46px;
  }

  .input-icon {
    width: 24px;
    height: 24px;
    margin-left: 0;
  }
}

.login-form :deep(.ant-input-prefix) {
  display: flex;
  align-items: center;
  color: #8a96a8;
}

.login-form :deep(.ant-input-affix-wrapper) {
  background-color: #f0f4f8;
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #e4eaf0;
  padding: 0 14px;
}

.login-form :deep(.ant-input-affix-wrapper .ant-input) {
  background: transparent;
  border: none;
  box-shadow: none;
  height: 100%;
}

.login-form :deep(.ant-input-affix-wrapper-focused) {
  border-color: rgba(24, 144, 255, 0.4);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.login-code-input {
  flex: 1;
  min-width: 0;
}

.send-code-btn {
  flex-shrink: 0;
  min-width: 112px;
  height: 46px;
  padding: 0 12px;
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

.login-btn-item {
  margin-top: 12px;
  margin-bottom: 0 !important;

  :deep(.ant-form-item-control-input-content) {
    display: block;
  }
}

.login-btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 2px;
  background: #1890ff;
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);

  &:hover,
  &:focus {
    background: #40a9ff;
  }
}

.login-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.login-link {
  color: #1890ff;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  margin-left: 32px;
  &:hover {
    color: #40a9ff;
  }
  &:nth-child(1) {
    margin-left: 0;
  }
}

.login-agreement {
  margin: 36px 0 0;
  text-align: center;
  color: #a0a8b5;
  font-size: 12px;
  line-height: 1.6;
}

@media (max-width: 960px) {
  .login-left {
    display: none;
  }

  .login-right {
    flex: 1;
    min-width: 0;
    padding-top: 80px;
  }
}
</style>
