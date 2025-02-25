<template>
  <u-tabbar v-model="value" @change="changeTab" fixed placeholder safeAreaInsetBottom>
    <u-tabbar-item text="首页" icon="home" to="/pages/index/index"></u-tabbar-item>
    <u-tabbar-item text="菜品" icon="shopping-cart" to="../../pages/menu/index"></u-tabbar-item>
    <u-tabbar-item text="订单" icon="order" to="/pages/order/index"></u-tabbar-item>
    <u-tabbar-item text="我的" icon="account" to="/pages/profile/index"></u-tabbar-item>
  </u-tabbar>
</template>

<script>
  export default {
    data() {
      return {
        value: 0,
        paths: ['/pages/index/index', '../../pages/menu/index"', '/pages/order/index', '/pages/profile/index'],
      }
    },
    methods: {
      changeTab(index) {
        const path = this.paths[index]
        if (path) {
          uni.switchTab({ url: path })
        }
      },
    },
  }
</script>
