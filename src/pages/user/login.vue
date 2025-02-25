<template>
  <div class="loginContainer">
    <view>
      <u--form class="loginForm" labelPosition="left" :model="userInfo" :rules="rules" ref="uForm">
        <u-form-item prop="phone" class="item">
          <u--input placeholder="账号" type="text" border="bottom" v-model="userInfo.phone"></u--input>
        </u-form-item>
        <u-form-item prop="password" class="item">
          <u--input placeholder="密码" type="password" border="bottom" v-model="userInfo.password"></u--input>
        </u-form-item>
        <u-form-item prop="code" class="item">
          <u--input placeholder="验证码" v-model="userInfo.code" border="bottom">
            <template slot="suffix">
              <u-code ref="uCode" @change="codeChange" seconds="20" changeText="X秒重新获取哈哈哈"></u-code>
              <u-button @tap="getCode" :text="tips" type="success" size="mini"></u-button>
            </template>
          </u--input>
        </u-form-item>
      </u--form>
    </view>
    <p class="login_tips">温馨提示：未注册过的账号，登录时将自动注册</p>
    <p class="login_tips">注册过的用户可凭账号密码登录</p>
    <view style="padding: 15px">
      <u-button type="success" text="登录" @click="mobileLogin"></u-button>
    </view>

    <u-toast ref="uToast"></u-toast>
    <router-link to="./forget" class="to_forget">重置密码？</router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tips: '获取验证码',
        userInfo: {
          phone: '19026372334',
          password: '', // 1234
          code: '',
        },
        randomCode: '', // 验证码
        rules: {
          phone: {
            type: 'string',
            required: true,
            message: '请填写正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: ['blur', 'change'],
          },
          password: {
            type: 'string',
            required: true,
            message: '请填写密码',
            trigger: ['blur', 'change'],
          },
          code: {
            type: 'string',
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change'],
          },
        },
      }
    },
    methods: {
      codeChange(text) {
        this.tips = text
      },
      getCode() {
        if (this.$refs.uCode.canGetCode) {
          // 模拟向后端请求验证码
          uni.showLoading({
            title: '正在获取验证码',
          })
          setTimeout(() => {
            uni.hideLoading()
            // 这里此提示会被this.start()方法中的提示覆盖
            this.randomCode = Math.floor(1000 + Math.random() * 9000)

            uni.$u.toast(`您此次的验证码为${this.randomCode}`)
            // 通知验证码组件内部开始倒计时
            this.$refs.uCode.start()
          }, 2500)
        } else {
          uni.$u.toast('倒计时结束后再发送')
        }
      },
      mobileLogin() {
        this.$refs.uForm
          .validate()
          .then(async res => {
            let data = {
              phone: this.userInfo.phone,
              password: this.userInfo.password,
              code: this.userInfo.code,
            }
            if (this.userInfo.code != this.randomCode) {
              this.$refs.uToast.show({
                type: 'error',
                message: '验证码错误',
                duration: 1500,
              })
              return
            }
            let result = await this.$u.api.user.login(data)

            if (result.code === 1) {
              this.$refs.uToast.show({
                type: 'success',
                message: result.msg,
                duration: 1500,
                complete: () => {
                  uni.setStorageSync('LoginAdmin', result.data)
                  this.$u.route({
                    url: '/pages/index/index',
                  })
                },
              })
            } else {
              this.$refs.uToast.show({
                type: 'error',
                message: result.msg,
                duration: 1500,
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
    },
    watch: {
      value(newValue, oldValue) {
        // console.log('v-model', newValue);
      },
    },
    onLoad() {
      // 动态设置页面标题
      uni.setNavigationBarTitle({
        title: '密码登录', // 设置标题文字
      })

      // 动态设置导航栏背景色和文字颜色
      uni.setNavigationBarColor({
        backgroundColor: '#4d8ee1', // 设置背景颜色
        frontColor: '#ffffff', // 设置文字颜色
      })
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/static/style/mixin';

  .loginForm {
    background-color: #fff;
    margin-top: 0.6rem;
    .input_container {
      display: flex;
      justify-content: space-between;
      padding: 0.6rem 0.8rem;
      border-bottom: 1px solid #f1f1f1;
    }
  }
  .login_tips {
    @include sc(0.5rem, red);
    padding: 0.4rem 0.6rem;
    line-height: 0.5rem;
    a {
      color: #3b95e9;
    }
  }
  .login_container {
    margin: 0 0.5rem 1rem;
    @include sc(0.7rem, #fff);
    background-color: #4cd964;
    padding: 0.5rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
  }

  .to_forget {
    float: right;
    @include sc(0.6rem, #3b95e9);
    margin-right: 0.3rem;
  }
</style>
