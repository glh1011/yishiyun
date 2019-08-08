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
  formatTime: formatTime,
  initChart: initChart,
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
  }
}