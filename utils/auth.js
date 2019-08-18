//获取工具类
const utils = require('util.js');

//获取应用实例
const app = getApp();

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  wx.checkSession({
    fail() {
      return false
    }
  })
  //将token传到后台服务器，检查是否过期
  var data = {
    token:token
  }
  const checkTokenRes = await utils.checkToken(data)
  console.log(checkTokenRes);
  //token已经过期了，返回false
  if (checkTokenRes.data.code != 201) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}
//微信授权登录
async function wxlogin(){
  let that = this;
  wx.login({
    success: function (loginRes) {
      if (loginRes) {
        //获取用户信息
        wx.getUserInfo({
          withCredentials: true,//非必填  默认为true
          success: function (infoRes) {
            console.log(infoRes, '>>>');
            //请求服务端的登录接口
            var data = {
              code: loginRes.code,//临时登录凭证
              rawData: infoRes.rawData,//用户非敏感信息
              signature: infoRes.signature,//签名
              encrypteData: infoRes.encryptedData,//用户敏感信息
              iv: infoRes.iv//解密算法的向量
            }
            utils.wxloginRequest(data).then(res => {
              console.log(res);
              if (res.data.code == 200) {
                //将微信用户信息保存在全局变量和本地缓存中
                console.log(JSON.stringify(res.data.data.userInfo));
                app.globalData.userInfo = res.data.data.userInfo;
                wx.setStorageSync('userInfo', JSON.stringify(res.data.data.userInfo));
                //将代表微信用户的唯一userid保存在全局变量和本地缓存中
                app.globalData.userId = res.data.data.skey;
                wx.setStorageSync('userId', res.data.data.skey)
              } else {
                console.log('res error');
              } 
            },err => {
              console.log(err);
            });
            
          }
        });
      } else {
      }
    }
  });
}

module.exports = {
  checkHasLogined: checkHasLogined,
  wxlogin: wxlogin
}