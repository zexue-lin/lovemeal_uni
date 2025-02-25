<template>
  <div class="loginContainer">
    <view>
      <u--form class="loginForm" labelPosition="left" :model="userInfo" :rules="rules" ref="uForm">
        <u-form-item prop="phone" class="item">
          <u--input placeholder="账号" type="text" border="bottom" v-model="userInfo.phone"></u--input>
        </u-form-item>
        <u-form-item prop="password" class="item">
          <u--input placeholder="旧密码" type="password" border="bottom" v-model="userInfo.OldPass"></u--input>
        </u-form-item>
        <u-form-item prop="password" class="item">
          <u--input placeholder="新密码" type="password" border="bottom" v-model="userInfo.NewPass"></u--input>
        </u-form-item>
        <u-form-item prop="password" class="item">
          <u--input placeholder="确认新密码" type="password" border="bottom" v-model="userInfo.NewRePass"></u--input>
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
    <view style="padding: 15px">
      <u-button type="success" text="确认修改" @click="forgetPass"></u-button>
    </view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tips: '获取验证码',
        userInfo: {
          phone: '',
          password: '', // 1234
          code: '',
        },
        randomCode: '', // 验证码
        rules: {
          phone: {
            type: 'string',
            required: true,
            message: '请填写正确的账号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: ['blur', 'change'],
          },
          OldPass: {
            type: 'string',
            required: true,
            message: '请填写旧密码',
            trigger: ['blur', 'change'],
          },
          MewPass: {
            type: 'string',
            required: true,
            message: '请输入新密码',
            trigger: ['blur', 'change'],
          },
          NewRePass: {
            type: 'string',
            required: true,
            message: '请确认新密码',
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
      forgetPass() {
        this.$refs.uForm
          .validate()
          .then(async res => {
            let data = {
              phone: this.userInfo.phone,
              OldPass: this.userInfo.OldPass,
              NewPass: this.userInfo.NewPass,
              NewRePass: this.userInfo.NewRePass,
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
            let result = await this.$u.api.user.ResetPass(data)

            if (result.code === 1) {
              this.$refs.uToast.show({
                type: 'success',
                message: result.msg,
                duration: 1500,
                complete: () => {
                  uni.setStorageSync('LoginAdmin', result.data)

                  // this.$u.route({
                  //   type: 'switchTab',
                  //   url: '/pages/user/login',
                  // })
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
        title: '密码重置', // 设置标题文字
      })

      // 动态设置导航栏背景色和文字颜色
      uni.setNavigationBarColor({
        backgroundColor: '#4d8ee1', // 设置背景颜色
        frontColor: '#ffffff', // 设置文字颜色
      })
    },
  }
</script>

<style lang="scss" scoped></style>
