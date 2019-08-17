const API_BASE_URL = 'https://mlquan.picp.vip/';
import * as echarts from '../ec-canvas/echarts';

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
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

const initChart = (canvas, width, height, option, element) => {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  if(element){
    return new Promise((resolve, reject) => {
      chart.on('finished', () => {
        element.canvasToTempFilePath({
          success: res => {
            resolve(res);
          },
          fail: res => {
            reject(res);
          }
        })
      })
    })
  }
  // return chart;
}

module.exports = {
  //提示框函数
  showToastWindow: showToastWindow,
  formatTime: formatTime,
  initChart: initChart,
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
    return sendRequest('','POST',data);
  },
  //完善信息请求
  perfectInfo:(data)=>{
    return sendRequest('api/user/perfectUser','POST',data);
  },
  //绑定卡号请求
  bindIcNumber:(data)=>{
    return sendRequest('api/user/bindingIC','POST',data);
  }
}