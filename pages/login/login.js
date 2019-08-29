// pages/login/login.js

//获取工具类
const utils = require('../../utils/util.js');
//获取应用实例
const app = getApp();
//获取授权实例
const AUTH = require('../../utils/auth.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    remind: '加载中',
    angle: 0,
    account:'',
    password:''
  },
  updateing:function(){
    utils.showToastWindow("功能升级中...");
  },
  /**
     * 获取账号
     */
  handleInputAccount: function (e) {
    var account = e.detail.value;
    this.setData({
      account: account
    })
  },
  /**
     * 获取密码
     */
  handleInputPassword: function (e) {
    var password = e.detail.value;
    this.setData({
      password: password
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    AUTH.checkHasLogined().then(isLogined => {
      console.log(isLogined);
      if (isLogined) {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      } else {
      }
    })
  },
  onGotUserInfo1(e) {
    if (!e.detail.userInfo) {
      utils.showToastWindow("拒绝授权将无法登录，请授权!");
      return;
    } else {
      console.log(e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', e.detail.userInfo);
      //微信的授权登录,从后台获得微信用唯一的uerId
      AUTH.wxlogin().then(res=>{
        wx.navigateTo({
          url: '../register/register',
        })
      },err=>{

      })
    }
  },

  onGotUserInfo(e) {
    if (!e.detail.userInfo) {
      utils.showToastWindow("拒绝授权将无法登录，请授权!");
      return;
    }else{
      console.log(e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', e.detail.userInfo);
      //微信的授权登录,从后台获得微信用唯一的uerId
      AUTH.wxlogin();
      //账号密码的登录，从后台获得用户的登录态标识符token
      this.login();
    }
  },

  /**
   * 登录事件
   */
  login: function () {
    var that = this;
    var account = that.data.account;
    var password = that.data.password;
    if (account == '' || account == null) {
      utils.showToastWindow("用户名不能为空!");
      return;
    } else if (password == '' || password == null) {
      utils.showToastWindow("密码不能为空!");
      return;
    } else {
      //加载提示框
      wx.showLoading({
        title: '登录中...',
      })
      var data = {
        telephoneNumber: account,
        password: password
      }
      utils.loginRequest(data).then(res => {
        console.log(res);
        wx.hideLoading();
        //登录成功
        if(res.data.code == 200){
          console.log("登录成功!!")
          //后台传过来的登录态标识符token
          var token = res.data.data.token;
          var sessionId = res.data.data.sessionId;
          //将token存储到全局变量和本地缓存中
          app.globalData.token = res.data.data.token;
          wx.setStorageSync('token', token);
          console.log("登录成功的token:"+token);
          // if (res && res.header && res.header['Set-Cookie']){
          //   wx.setStorageSync('sessionId', res.header['Set-Cookie']);
          // }
          wx.setStorageSync('sessionId', sessionId);
          console.log("登录成功的sessionId:" + sessionId);
          //切换到首页
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }else{
          utils.showToastWindow("账号或者密码错误,请重新输入!");
          return;
        }
      }, err => {
        utils.showToastWindow("登录失败,请稍后重试!");
        return;
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
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