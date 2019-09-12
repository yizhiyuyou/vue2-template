<template>
  <div class="map-layout">
    <the-header />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'

export default {
  name: 'MapLayout',
  components: {
    TheHeader,
  },
}
</script>

<style lang="less" scoped>
@import url('../assets/static/style/common.less');

.map-layout {
  background-color: #ebeef0;

  .container {
    min-width: 1200px;
    height: calc(~'100vh - 50px');
    min-height: 700px;
  }
}
</style>
