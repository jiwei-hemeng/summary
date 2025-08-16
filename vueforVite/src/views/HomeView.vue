<script setup name="HomeView">
import { useRouter } from "vue-router";
import MenuLsit from "@/components/menuList.vue";

const router = useRouter();

function changePage(path) {
  router.push(path);
}

// @ts-ignore
</script>
<template>
  <div>
    <div>编程式导航</div>
    <MenuLsit :list="[{ name: 'About', path: '/about' }]" @changePage="changePage" />
  </div>
</template>
