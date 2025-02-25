// 引入目录里面的所有js文件


// console.log(files.keys())

const files = require.context(".", false, /\.js$/);

// 存放引入api
const list = {}

// 循环
files.keys().forEach((key) => {
    // key === ./index.js 就不执行后面的代码
    if (key === "./index.js") return

    // 获取api
    const item = files(key).default

    // 对象合并
    Object.assign(list, item)
})

export default list