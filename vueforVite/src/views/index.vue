<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="wrapper">
    <nav>
      <RouterLink class="nav_link" to="/">首页</RouterLink>
      <RouterLink class="nav_link" to="/about">About</RouterLink>
      <RouterLink class="nav_link" to="/KeyFrames">KeyFrames</RouterLink>
      <RouterLink class="nav_link" to="/authRouter">AuthRouter</RouterLink>
      <RouterLink class="nav_link" to="/eventEmitter">EventEmitter</RouterLink>
      <RouterLink class="nav_link" to="/map">百度地图</RouterLink>
      <RouterLink class="nav_link" to="/chinaMap">中国地图</RouterLink>
      <RouterLink class="nav_link" to="/webCamera">拍照功能</RouterLink>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>
<style scoped>
.nav_link {
  margin-right: 10px;
  color: #108ee9;
  text-decoration: none;
}
nav {
  box-sizing: border-box;
  padding-left: 5px;
}
main {
  box-sizing: border-box;
  padding: 5px;
}
</style>
