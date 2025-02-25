// 引入每个目录里面的index.js
const files = require.context("./", true, /index.js$/);
/* 
    api/index.js
    ./index.js
*/

// 存放api
const modules = {};

files.keys().forEach((key) => {
  // 等于./index.js就不执行后面代码
  if (key === "./index.js") return;

  // 获取所有的api
  const item = files(key).default;

  // 存放组装好的api
  var mod = {};

  // 替换路径
  var name = key.replace(/\.\/(.*)\/index.js/, "$1");

  // 用目录名表示顶级
  //   {
  //     admin: {
  //       wxLogin: {
  //       },
  //       login:{

  //       }
  //     }
  //   }
  // this.$u.api.admin.wxLogin() $u => uView uni => uniapp
  mod[name] = item;

  Object.assign(modules, mod);
});


const install = (Vue, vm) => {
  //加载模块
  modules;

  //循环组合接口API
  let api = {}

  for (let ModeName in modules) {
    if (JSON.stringify(modules[ModeName]) == "{}") {
      continue;
    }

    for (let ApiName in modules[ModeName]) {
      // 把每个目录下的除了index.js的所有js文件的对象赋值给config
      let config = modules[ModeName][ApiName];

      // 把对象名称赋值config的name属性
      config.name = ApiName;

      // 如果config的name属性或者url属性等于false 就跳出当前循环
      if (!config.name || !config.url) {
        continue;
      }

      // 假设api的admin属性等于false 那么api的admin变成对象类型
      if (!api[ModeName]) {
        api[ModeName] = {};
      }

      // 判断引入接口的请求方法是属于哪个
      switch (config.method.toUpperCase()) {
        case "GET":
          // this.$u.api.admin.WxLogin() => api['admin']['WxLogin'] = () => {}
          api[ModeName][config.name] = (data = {}) => {
            return uni.$u.http.get(config.url, data);
          };
          break;
        case "POST":
           /* 
            由于每个目录引入的都是对象，不是方法，因为发起请求需要uVIew的http的api
            所以重组api的结构
            api
              admin
                Wxlogin:{
                  name:'',
                  url:'',
                  method:''
                }

            =>

            api
                admin
                   WxLogin => () => {}
            */
          api[ModeName][config.name] = (data = {}) => {
            return uni.$u.http.post(config.url, data);
          };
          break;
        case "UPLOAD":
          api[ModeName][config.name] = (data = {}) => {
            if (data.filePath) {
              return uni.$u.http.upload(config.url, data);
            } else {
              return uni.$u.http.post(config.url, data);
            }
          };
          break;
      }
    }
  }
  // vm => 应用(app => this) $u => uView对象 api => 把所有的接口赋值给uView的api属性
  vm.$u.api = api;
};

export default {
  install,
};