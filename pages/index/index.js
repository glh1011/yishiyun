//index.js
//获取应用实例
const app = getApp()
const AUTH = require('../../utils/auth')

Page({
  data: {
    PageCur: 'home',
  },
  onLoad(){
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})
