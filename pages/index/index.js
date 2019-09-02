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

  onShow() {
    if (this.selectComponent("#userComponent")) {
      this.selectComponent("#userComponent").getData();
    }
  },

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },

})
