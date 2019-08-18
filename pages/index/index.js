//index.js
//获取应用实例
const app = getApp()
const AUTH = require('../../utils/auth')

Page({
  data: {
    PageCur: 'home',
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      console.log(isLogined);
      if (!isLogined) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      } else {
      }
    })
  },

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})
