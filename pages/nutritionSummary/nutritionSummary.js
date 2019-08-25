// pages/nutritionSummary/nutritionSummary.js

var util = require("../../utils/time-utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectWeek: 0,
    timeBean: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 点击了上一周，选择周数字减一，然后直接调用工具类中一个方法获取到数据
   */
  lastWeek: function (e) {
    var selectWeek = --this.data.selectWeek;
    var timeBean = this.data.timeBean
    timeBean = util.getWeekDayList(selectWeek)

    if (selectWeek != 0) {
      timeBean.selectDay = 0;
    }

    this.setData({
      timeBean,
      selectWeek
    })
  },

  /**
   * 点击了下一周，选择周数字加一，然后直接调用工具类中一个方法获取到数据
   */
  nextWeek: function (e) {
    var selectWeek = ++this.data.selectWeek;
    var timeBean = this.data.timeBean
    timeBean = util.getWeekDayList(selectWeek)

    if (selectWeek != 0) {
      timeBean.selectDay = 0;
    }

    this.setData({
      timeBean,
      selectWeek
    })
  },

  /**
   * 选中了某一日，改变selectDay为选中日
   */
  dayClick: function (e) {
    var timeBean = this.data.timeBean
    timeBean.selectDay = e.detail;
    this.setData({
      timeBean,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      timeBean: util.getWeekDayList(this.data.selectWeek)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})