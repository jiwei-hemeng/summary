<script setup name="HomeView">
import MenuLsit from "@/components/menuList.vue"
import { useRouter } from "vue-router"
const router = useRouter()

function changePage(path) {
  router.push(path)
}

</script>
<template>
  <div>
    <div>编程式导航</div>
    <MenuLsit
      :list="[{ name: 'About', path: '/about' }]"
      @change-page="changePage" />
  </div>
</template>
