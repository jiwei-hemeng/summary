export default {
  // 路由国际化
  route: {
    dashboard: "Dashboard",
    document: "Document"
  },
  // 登录页面国际化
  login: {
    selectPlaceholder: "Please select/enter a company name",
    username: "Please enter username",
    password: "Please enter password",
    login: "Login",
    logging: "Logging...",
    code: "Please enter verification code",
    accountLogin: "Account Login",
    phoneLogin: "Phone Login",
    phone: "Please enter your phone number",
    smsCode: "Please enter verification code",
    sendSmsCode: "Send Code",
    sendSmsCodeSuccess: "Verification code sent",
    sendSmsCodePhoneRequired: "Please enter your phone number first",
    sendSmsCodePhoneInvalid: "Please enter a valid phone number",
    phoneLoginDeveloping: "Phone verification login is under development",
    registerNow: "Register Now",
    forgotPassword: "Forgot Password",
    forgotPasswordTip: "Please contact the administrator to reset your password",
    agreementPrefix: "By registering or logging in, you agree to the",
    userAgreement: "User Service Agreement",
    agreementTip: "User service agreement is not configured yet",
    rememberPassword: "Remember me",
    rule: {
      tenantId: {
        required: "Please enter your tenant id"
      },
      username: {
        required: "Please enter your account"
      },
      password: {
        required: "Please enter your password"
      },
      code: {
        required: "Please enter a verification code"
      },
      phone: {
        required: "Please enter your phone number",
        pattern: "Please enter a valid phone number"
      },
      smsCode: {
        required: "Please enter a verification code"
      }
    },
    social: {
      wechat: "Wechat Login",
      maxkey: "MaxKey Login",
      topiam: "TopIam Login",
      gitee: "Gitee Login",
      github: "Github Login"
    }
  },
  // 导航栏国际化
  navbar: {
    full: "Full Screen",
    language: "Language",
    dashboard: "Dashboard",
    document: "Document",
    message: "Message",
    layoutSize: "Layout Size",
    selectTenant: "Select Tenant",
    layoutSetting: "Layout Setting",
    personalCenter: "Personal Center",
    logout: "Logout"
  },
  slideVerify: {
    title: "Security Verify",
    subtitle: "Drag the slider to complete verification",
    refresh: "Refresh",
    tip: "Drag right to complete the puzzle",
    success: "Verified",
    fail: "Failed",
    loading: "Loading...",
    statusIdle: "Awaiting verification",
    statusScanning: "Analyzing behavior...",
    statusPassed: "Identity confirmed",
    statusFailed: "Verification failed"
  }
};
