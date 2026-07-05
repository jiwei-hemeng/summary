export default {
  // 路由国际化
  route: {
    dashboard: "首页",
    document: "项目文档"
  },
  // 登录页面国际化
  login: {
    selectPlaceholder: "请选择/输入公司名称",
    accountLogin: "账号登录",
    phoneLogin: "手机登录",
    username: "请输入您的账号",
    password: "请输入您的密码",
    phone: "请输入手机号",
    smsCode: "请输入验证码",
    login: "登录",
    logging: "登录中...",
    code: "请输入验证码",
    sendCode: "发送验证码",
    registerNow: "立即注册",
    forgotPassword: "忘记密码",
    agreementPrefix: "注册登录即表示同意",
    userAgreement: "用户服务协议",
    forgotPasswordTip: "请联系管理员重置密码",
    agreementTip: "用户协议暂未开放",
    sendCodeSuccess: "验证码已发送",
    phoneLoginTip: "手机登录功能开发中",
    rememberPassword: "记住我",
    rule: {
      tenantId: {
        required: "请输入您的租户编号"
      },
      username: {
        required: "请输入您的账号"
      },
      password: {
        required: "请输入您的密码"
      },
      code: {
        required: "请输入验证码"
      },
      phone: {
        required: "请输入手机号",
        pattern: "请输入正确的手机号"
      },
      smsCode: {
        required: "请输入验证码"
      }
    },
    social: {
      wechat: "微信登录",
      maxkey: "MaxKey登录",
      topiam: "TopIam登录",
      gitee: "Gitee登录",
      github: "Github登录"
    }
  },
  // 导航栏国际化
  navbar: {
    full: "全屏",
    language: "语言",
    dashboard: "首页",
    document: "项目文档",
    message: "消息",
    layoutSize: "布局大小",
    selectTenant: "选择租户",
    layoutSetting: "布局设置",
    personalCenter: "个人中心",
    logout: "退出登录"
  },
  slideVerify: {
    title: "安全验证",
    subtitle: "拖动滑块完成人机校验",
    refresh: "刷新",
    tip: "向右拖动滑块完成拼图",
    success: "验证通过",
    fail: "验证失败",
    loading: "加载中...",
    statusIdle: "等待验证",
    statusScanning: "行为分析中...",
    statusPassed: "身份已确认",
    statusFailed: "校验未通过"
  }
};
