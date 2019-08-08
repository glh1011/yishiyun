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
  initChart: initChart
}
