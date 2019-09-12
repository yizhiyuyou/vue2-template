<template>
  <div class="the-no-find">
    <base-result status="404" sub-title="抱歉,你访问的页面不存在." title="404">
      <el-button type="primary" @click="handleClick">回首页</el-button>
    </base-result>
  </div>
</template>

<script>
import BaseResult from './BaseResult'

import { pages } from '@/config'

export default {
  name: 'TheNoPermission',
  components: {
    BaseResult,
  },
  methods: {
    handleClick() {
      this.$router.replace(pages.home.path)
    },
  },
}
</script>

<style lang="less" scoped>
.the-no-find {
  box-sizing: border-box;
  min-height: 100vh;
  padding-top: 150px;
}
</style>
