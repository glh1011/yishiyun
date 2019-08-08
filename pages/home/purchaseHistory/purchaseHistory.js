import utils from "../../../utils/util.js";

const app = getApp();

Page({
  data: {
    ec: {},
    echartImgSrc: '',
    monthArray: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    index: 0,
    curYear: '',
    curMonthsArray: '',
    TabCur: 0,
    scrollLeft: 0,
    today: '',
    date: '',
    CustomBar: app.globalData.CustomBar,
  },

  onLoad: function (options) {
    var today = new Date();
    const curYear = today.getFullYear();
    const curMonth = today.getMonth() + 1;
    const curMonthsArray = this.data.monthArray.slice(0, curMonth);
    this.setData({
      curYear: curYear,
      index: curMonth - 1,
      curMonthsArray: curMonthsArray
    })
    var d = utils.formatTime(today);
    this.setData({
      today: d,
      date: d
    });
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  dayPurchaseEchartInit(e) {
    var option = {
      backgroundColor: "#ffffff",
      color: ['#9085FB', '#FFCD6D', '#FC9E9E', '#8BC34A'],
      series: [{
        type: 'pie',
        radius: ['20%', '60%'],
        data: [
          { value: 78, name: '水果' },
          { value: 13, name: '肉类' },
          { value: 21, name: '主食' },
          { value: 31, name: '蔬菜' }
        ],
      }]
    };
    let element = this.selectComponent('#mychart-dom-pie1');
    utils.initChart(e.detail.canvas, e.detail.width, e.detail.height, option, element)
      .then((res) => {
        this.setData({
          echartImgSrc: res.tempFilePath
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})