const install =(Vue,vm)=>{
  let check =()=>{
    console.log('sas')
    // 获取本地存储的信息
    let LoginAdmin =uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin'):{}

    if(!LoginAdmin||JSON.stringify(LoginAdmin)==='{}')
    {
      uni.showToast({
        title:'请先登录',
        icon:'error',
        duration:1500,
        success:()=>{
          setTimeout(()=>{
            uni.navigateTo({
                url:'/pages/admin/login'
              })
          },1500)
        }
      })
      return false
    }
    return true
  }

  vm.$u.auth={
    check
  }
}

export default {
  install
}