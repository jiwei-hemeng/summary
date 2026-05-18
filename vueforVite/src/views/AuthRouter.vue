<template>
  <div class="auth">
    <div>鉴权路由</div>
    <JIcon name="certificate-copy" color="#f00" size="28px"></JIcon>
  </div>
</template>
<script setup lang="ts">
import JIcon from "@/components/JIcon.vue";
import { reactive, toRef, toRefs } from "vue";
const state = reactive({
  foo: 1,
  bar: 2
});
// 双向 ref，会与源属性同步
const fooRef = toRef(state, "foo");
// 更改该 ref 会更新源属性
fooRef.value++;
// 更改源属性也会更新该 ref
state.foo++;
const { bar } = toRefs(state);
</script>
<style scoped>
.auth {
  height: 2000px;
}
</style>
