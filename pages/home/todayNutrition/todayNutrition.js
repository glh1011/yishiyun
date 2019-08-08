import utils from "../../../utils/util.js";

Page({
  data: {
    ec: {},
    today:'',
    date: '',
    calorieEchartImgSrc: '',
    mainNutritionEchartImgSrc: ''
  },

  onLoad: function (options) {
    var today = new Date();
    var d = utils.formatTime(today);
    this.setData({
      today: d,
      date: d
    });
  },

  calorieEchartInit(e) {
    var option = {
      backgroundColor: "#ffffff",
      color: ['#28B8A1', '#aaa'],
      series: [{
        type: 'pie',
        radius: ['20%', '60%'],
        data: [
          { value: 78, name: '已摄入' },
          { value: 13, name: '未摄入' }
        ],
      }]
    };
    let element = this.selectComponent('#mychart-dom-pie-calorie');
    utils.initChart(e.detail.canvas, e.detail.width, e.detail.height, option, element)
      .then((res) => {
        this.setData({
          calorieEchartImgSrc: res.tempFilePath
        })
      }).catch((res) => {
        console.log('转换图片失败', res);
      });
  },

  mainNutritionEchartInit(e) {
    var option = {
      backgroundColor: "#ffffff",
      color: ['#9085FB', '#FFCD6D', '#FC9E9E'],
      series: [{
        type: 'pie',
        radius: ['20%', '60%'],
        data: [
          { value: 78, name: '碳水' },
          { value: 13, name: '脂肪' },
          { value: 21, name: '蛋白质' }
        ],
      }]
    };
    let element = this.selectComponent('#mychart-dom-pie-mainNutrition');
    utils.initChart(e.detail.canvas, e.detail.width, e.detail.height, option, element)
      .then((res) => {
        this.setData({
          mainNutritionEchartImgSrc: res.tempFilePath
        })
      }).catch((res) => {
        console.log('转换图片失败', res);
      });
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
})