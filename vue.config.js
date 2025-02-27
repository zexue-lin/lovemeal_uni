// vue.config.js，如没有此文件则手动创建
// 引入路径模块
const path = require('path') // ✅ 解决 ES Module 语法错误


module.exports = {
  transpileDependencies: ['uview-ui'],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
    // 以下为接口代理设置,但是仅在H5模式下面支持，如需要配置其他小程序的接口地址，请移步到 services/request.js
	devServer: {
        proxy: {
            '/u/v1/': {
                target: 'http://127.0.0.1:8028',  //本地
                // 如果接口跨域，需要进行这个参数配置
                changeOrigin: true,
                pathRewrite: {
                    '^/u/v1/': '/u/v1/'// 则不会改变请求路径，因此路径是原样传递给目标服务器。匹配到/u/v1/改成/u/v1
                },
            }
        },
     
    },
    
}