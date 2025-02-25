<template>
  <view>
    <!-- vue2  ✅ 需要一个根元素包裹 -->
    <view>
      <u-notice-bar :text="text1" mode="closable"></u-notice-bar>
    </view>
    <!-- 滚动通知end -->
    <!-- Album 相册 -->
    <view class="u-page">
      <view class="u-demo-block">
        <text class="u-demo-block__title">多图模式</text>
        <view class="u-demo-block__content">
          <view class="album">
            <view class="album__avatar">
              <image src="http://110.41.54.76:13262//uploads/img/2025/0218/20250218143533-1431.jpg" mode="" style="width: 32px; height: 32px"></image>
            </view>
            <view class="album__content">
              <u--text text="uView UI" type="primary" bold size="17"></u--text>
              <u--text margin="0 0 8px 0" text="全面的组件和便捷的工具会让您信手拈来，如鱼得水"></u--text>
              <u-album :urls="urls2"></u-album>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 横向滚动列表 -->
    <u-scroll-list>
      <view v-for="(item, index) in list" :key="index">
        <image :src="item.thumb" style="width: 150px; height: 150px"></image>
      </view>
    </u-scroll-list>

    <Tabbar />
  </view>
</template>

<script>
  import Tabbar from 'components/common/tabbar.vue'
  export default {
    components: {
      Tabbar,
    },
    data() {
      return {
        albumWidth: 0,
        urls2: [
          'http://110.41.54.76:13262/uploads/img/2025/0218/20250218144104-1617.jpg',
          'http://110.41.54.76:13262/uploads/img/2025/0218/20250218144350-5949.jpg',
          'http://110.41.54.76:13262/uploads/img/2025/0218/20250218144553-3743.jpg',
          'http://110.41.54.76:13262/uploads/img/2025/0218/20250218145051-8298.jpg',
          'http://110.41.54.76:13262/uploads/img/2025/0218/20250218150131-3582.jpg',
          'http://110.41.54.76:13262//uploads/img/2025/0218/20250218152202-5890.jpg',
          // 'https://xxx.com/album/7.jpg',
          // 'https://xxx.com/album/8.jpg',
          // 'https://xxx.com/album/9.jpg',
          // 'https://xxx.com/album/10.jpg',
        ],
        text1: '今日上线芋头蒸米饭,仅需￥1/碗', //滚动通知
        list: [
          //横向滚动列表
          {
            thumb: 'http://110.41.54.76:13262/uploads/test/2025/0218/20250218152313-7316.png',
          },
          {
            thumb: 'http://110.41.54.76:13262/uploads/test/2025/0218/40229.jpg',
          },
          {
            thumb: 'http://localhost:8080/static/logo.png',
          },
          {
            thumb: 'http://localhost:8080/static/logo.png',
          },
          {
            thumb: 'http://localhost:8080/static/logo.png',
          },
        ],
      }
    },
    onLoad() {
      let LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}

      if (!LoginAdmin || JSON.stringify(LoginAdmin) === '{}') {
        uni.showToast({
          title: '请先登录',
          icon: 'error',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/user/login',
              })
            }, 1500)
          },
        })
        return false
      }
    },
    methods: {
      goToLogin() {
        uni.navigateTo({
          url: '/pages/user/login',
        })
      },
    },
  }
</script>

<style lang="scss">
  .album {
    @include flex;
    align-items: flex-start;

    &__avatar {
      background-color: $u-bg-color;
      padding: 5px;
      border-radius: 3px;
    }

    &__content {
      margin-left: 10px;
      flex: 1;
    }
  }
</style>
