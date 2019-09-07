//index.js
//获取应用实例
const app = getApp()
const AUTH = require('../../utils/auth')

Page({
  data: {
    PageCur: 'home',

  },
  onLoad(){
    AUTH.checkHasLogined().then(res=>{
      app.globalData.indexLoginStatus = res;
    })
    let query = wx.createSelectorQuery().in(this);
    // 然后逐个取出navbar和header的节点信息
    // 选择器的语法与jQuery语法相同
    query.select('.foot').boundingClientRect();
    query.exec((res) => {
      // 分别取出navbar和header的高度
      let navbarHeight = res[0].height;
      app.globalData.navbarHeight = navbarHeight;
      console.log(navbarHeight);
    });
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
