import { createRouter, createWebHashHistory } from "vue-router";
import { useToken } from "@/stores/useInfo";
import pinia from "@/stores/index";
import { Modal } from "ant-design-vue";
const pages = import.meta.glob("@/views/**/page.js", {
  eager: true,
  import: "default"
});
const components = import.meta.glob("@/views/**/index.vue");
const routesList = Object.entries(pages).map(([path, meta]) => {
  const compath = path.replace("/page.js", "/index.vue");
  path = path.replace("/src/views", "").replace("/page.js", "") ?? "/";
  const name = path.split("/").filter(Boolean).join("-") ?? "index";
  const component = components[compath];
  return {
    name,
    path,
    component,
    meta
  };
});
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/index.vue"),
      name: "Index",
      children: [
        { path: "/", redirect: "/home" },
        {
          path: "/home",
          name: "Home",
          component: () => import("@/views/HomeView.vue"),
          meta: { requiresAuth: false, title: "首页" }
        },
        ...routesList
      ]
    },
    {
      path: "/authRouter",
      name: "AuthRoute",
      component: () => import("@/views/AuthRouter.vue"),
      meta: { requiresAuth: true, savedPosition: true, title: "鉴权路由" }
    },
    {
      path: "/:pathMatch(.*)",
      name: "NotFound404",
      component: () => import("@/views/NotFound404.vue"),
      meta: { requiresAuth: false, savedPosition: false, title: "404" }
    }
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (to.meta.savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { top: 0 };
      }
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to) => {
  const store = useToken(pinia);
  document.title = typeof to.meta.title === "string" ? to.meta.title : "默认标题";
  if (to.meta.requiresAuth && !store.isLogin) {
    Modal.error({
      title: "提示",
      content: "没有访问权限..."
    });
    // 去授权页面
    return { name: "About" };
  }
});

export default router;
