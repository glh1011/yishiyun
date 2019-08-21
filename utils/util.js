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

/**
 * 对wx.request请求进行二次封装
 */
const sendRequest = (url, method, data = {}, header = {}) => {
  let _url = API_BASE_URL + url
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
  formatTime: formatTime,
  //wx.request的二次封装
  sendRequest: sendRequest,
  //通过手机号查找用户是否存在
  queryUserByPhone: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded'};
    return sendRequest('api/user/verification','POST',data,header);
  },
  //注册请求
  registerRequest: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded'};
    return sendRequest('api/user/register','POST',data,header);
  },
  //登录请求
  loginRequest: (data) => {
    var header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return sendRequest('', 'POST', data, header);
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