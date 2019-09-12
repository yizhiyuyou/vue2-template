<template>
  <div class="the-no-permission">
    <base-result status="403" sub-title="抱歉,你无权访问此页面." title="403">
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
.the-no-permission {
  box-sizing: border-box;
  min-height: 100vh;
  padding-top: 150px;
}
</style>
