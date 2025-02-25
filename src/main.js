import Vue from 'vue';
import App from './App';;
import uView from "uview-ui";
import './uni.promisify.adaptor'

Vue.use(uView);


// 校验登录
// import auth from '@/services/auth'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
// 引入请求封装
require('services/request.js')(app)

// 引入接口
import api from '@/api/index.js'
Vue.use(api,app)
// Vue.use(auth,app)



app.$mount()
