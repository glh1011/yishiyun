const API_BASE_URL = 'https://mlquan.picp.vip/';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return formatNumber(year)+"-"+formatNumber(month)+"-"+formatNumber(day);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const showToastWindow = (title, icon = null, image = null) => {
  wx.showToast({
    title: title,
    icon: icon,
    image: image,
    duration: 2000
  })
}

/**
 * 对wx.request请求进行二次封装
 */

const sendRequest = (url, method, data) => {
  let _url = API_BASE_URL + url
  let sessionId = wx.getStorageSync('sessionId');
  // console.log(sessionId);
  var header = {}
  if (sessionId != "" && sessionId != null){
    header = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'sessionId': sessionId
    }
  }else{
    header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  // console.log(header)
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      data: data,
      method: method,
      header: header,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

module.exports = {
  //提示框函数
  showToastWindow: showToastWindow,
  formatTime: formatTime,
  //wx.request的二次封装
  sendRequest: sendRequest,
  //通过手机号查找用户是否存在
  queryUserByPhone: (data) => {
    return sendRequest('api/user/verification', 'POST', data);
  },
  //注册请求
  registerRequest: (data) => {
    return sendRequest('api/user/registerUser', 'POST', data);
  },
  //微信授权请求
  wxloginRequest:(data) => {
    return sendRequest('api/wexin/WeXinLogin','POST',data);
  },
  //登录请求
  loginRequest: (data) => {
    return sendRequest('api/user/login', 'POST', data);
  },
  //登录态判断
  checkToken: (data) => {
    return sendRequest('api/user/checkToken','POST',data);
  },
  //完善信息请求
  perfectInfo:(data)=>{
    return sendRequest('api/user/perfectUser','POST',data);
  },
  //绑定卡号请求
  bindIcNumber:(data)=>{
    return sendRequest('api/user/bindingIC','POST',data);
  },
  //首页今日摄入量分析获取
  queryIntake: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return sendRequest('api/homePage/calorieAnalyze', 'POST', data, header);
  },
  //首页用户最近一次就餐记录获取
  queryLastEatLog: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return sendRequest('api/homePage/lastEatLog', 'POST', data, header);
  },
  //首页最受欢迎菜品获取
  queryMostLike: () => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return sendRequest('api/homePage/likedDish', 'POST', header);
  },
  //用户就餐记录获取
  queryEatLog: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return sendRequest('api/consumptionLog/EatLogByDay', 'POST', data, header);
  },
  //营养分析
  queryTrophicAnalysis: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return sendRequest('api/trophicAnalysis/taByday', 'POST', data, header);
  },
  //消费记录
  queryEatLogByMonth: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return sendRequest('api/consumptionLog/EatLogByMonth', 'POST', data, header);
  },
}