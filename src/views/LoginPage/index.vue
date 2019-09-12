<template>
  <div class="login-container">
    <div class="header">
      <img src="/static/img/login/logo.png" alt="logo" draggable="false" />
    </div>
    <div class="body">
      <div class="system-name">路网运行监测与应急处置系统</div>
      <div class="main">
        <img src="/static/img/login/left.png" alt="left image" class="image" draggable="false" />
        <div class="form-container">
          <el-input v-model="username" placeholder="请输入账号" class="m-b-55">
            <img slot="prefix" src="/static/img/login/username.png" />
          </el-input>
          <el-input v-model="password" type="password" placeholder="请输入密码" class="m-b-74">
            <img slot="prefix" src="/static/img/login/password.png" />
          </el-input>
          <el-button type="primary" :loading="isLoading" @click="loginClickHandler">登录</el-button>
        </div>
      </div>
      <div class="company-name">技术支持：河南东方世纪交通科技股份有限公司</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { pages } from '@/config'

export default {
  name: 'Login',
  data() {
    return {
      username: 'admin',
      password: '111111',
      isLoading: false,
    }
  },
  computed: mapState(['loaded']),
  mounted() {
    this.loaded && this.$router.push(pages.home.path)
  },
  methods: {
    ...mapActions(['pageLogin']),
    async loginClickHandler() {
      const { username, password } = this

      this.isLoading = true

      try {
        await this.pageLogin({
          username,
          password,
        })
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/static/style/common';

.login-container {
  display: flex;
  flex-direction: column;

  .header {
    padding: 26px 160px;
  }

  .body {
    box-sizing: border-box;
    padding: 90px 0 80px 0;
    background-color: @color-blue-2;
    height: 828px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .system-name {
      font-size: 30px;
      font-weight: bold;
    }

    .main {
      display: flex;
      align-items: center;
      margin-left: -280px;
      min-width: 1410px;
      margin-top: -120px;

      .form-container {
        box-sizing: border-box;
        width: 425px;
        height: 427px;
        margin-left: 40px;
        margin-top: 90px;
        background-color: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(224, 224, 224, 0.2);
        border-radius: 4px;
        padding: 78px 44px 80px 50px;

        .el-input {
          /deep/ .el-input__inner {
            background-color: transparent;
            border: none;
            border-radius: 0;
            border-bottom: 1px solid #fff;
            color: #fff;
            font-size: 16px;
            height: 45px;
            padding-top: 4px;
            padding-bottom: 24px;
            padding-left: 50px;

            &::-webkit-input-placeholder {
              color: #fff;
            }

            &:-moz-placeholder {
              color: #fff;
            }

            &:-ms-input-placeholder {
              color: #fff;
            }
          }

          /deep/ .el-input__prefix {
            left: 10px;
          }
        }

        .el-button {
          font-size: 18px;
          padding: 15px;
          width: 330px;
          background-color: @color-blue-2;
          border: 1px solid @color-blue-2;

          &:hover {
            background-color: darken(@color-blue-2, 2);
          }
        }
      }
    }

    .company-name {
      font-size: 14px;
      margin-top: -30px;
    }
  }

  .m-b-55 {
    margin-bottom: 55px;
  }

  .m-b-74 {
    margin-bottom: 74px;
  }
}
</style>
