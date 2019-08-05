// pages/login/login.js

//获取工具类
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false
  },

  /**
   * 登录事件
   */
  loginSubmit:function(e){
    wx.showLoading({
      title: '登录中...',
    })
    console.log(e);
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    this.setData({
      disabled:true
    });
    if(account == '' || account == null){

    }else if(password == '' || password == null){

    }else{

    }
    var data = {

    }
    utils.loginRequest(data).then(res => {

    },err => {

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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