<template>
  <div class="the-header">
    {{ realname }}
    <el-button type="primary" @click="pageLogout">注销</el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TheHeader',
  computed: mapState(['realname']),
  methods: {
    ...mapActions(['pageLogout']),
  },
}
</script>

<style lang="less" scoped>
.the-header {
  width: 100%;
}
</style>
