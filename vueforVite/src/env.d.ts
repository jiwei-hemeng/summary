declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // 使用泛型参数，但不指定具体类型
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
