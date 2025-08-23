import {ref} from "vue";
export default function <T extends new (...args: any[]) => void>(_comp: T) {
  // 返回一个 ref，其值的类型是指定组件构造函数的实例类型
  return ref<InstanceType<T>>();
}