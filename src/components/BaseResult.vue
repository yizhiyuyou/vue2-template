<template>
  <div class="base-result">
    <slot name="icon">
      <img :src="`/static/img/common/${status}.svg`" alt="图像" />
    </slot>
    <span class="title">{{ title }}</span>
    <span class="sub-title">{{ subTitle }}</span>
    <slot name="default"></slot>
  </div>
</template>

<script>
const STATUS = ['404', '403', '500']

export default {
  name: 'BaseResulte',
  props: {
    status: {
      type: String,
      default: STATUS[0],
      validator(status) {
        return STATUS.includes(status)
      },
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less" scoped>
.base-result {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;
    line-height: 1.8;
    text-align: center;
    margin-top: 24px;
  }

  .sub-title {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
    margin-bottom: 28px;
  }
}
</style>
