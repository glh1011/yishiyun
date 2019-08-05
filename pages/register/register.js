// pages/register/register.js
//引入榛子短信验证js文件
var zhenzisms = require('../../utils/zhenzisms.js');
//引入图形验证码
var Mcaptcha = require('../../utils/mcaptcha.js');
//获取应用实例
const app = getApp();
//获取工具类
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    numList: [{
      name: '注册账户'
    }, {
      name: '完善资料'
    }, {
      name: '绑定餐卡'
    }],
    num: 0,
    text: '获取验证码',
    currentTime: 61, //倒计时
    registerBtnDisabled: false, //立即注册按钮是否禁用
    disabled: true, //获取验证码按钮是否禁用
    phone: '', //获取到的手机栏中的值
    CheckCode: '', //获取到验证码
    Code: '', //输入的短信验证码，
    code: '',
    NewChanges: '', //获取输入的登录密码
    NewChangesAgain: '' //获取再次输入的密码
  },
  /**
   * 获取手机号
   */
  handleInputPhone: function(e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
    if (phone != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  /**
   * 获取图片验证码
   */
  handleCheckCode: function(e) {
    console.log(e);
    this.setData({
      CheckCode: e.detail.value
    })
  },
  /**
   * 获取短信验证码
   */
  handleVerificationCode: function(e) {
    console.log(e);
    this.setData({
      Code: e.detail.value
    })
  },
  /**
   * 获取设置的密码
   */
  handleNewChanges: function(e) {
    console.log(e);
    this.setData({
      NewChanges: e.detail.value
    })
  },
  /**
   * 获取确认的密码
   */
  handleNewChangesAgain: function(e) {
    console.log(e);
    this.setData({
      NewChangesAgain: e.detail.value
    })
  },
  /**
   * 步骤条数字加一
   */
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },

  /**
   * 验证短信验证码
   */
  validateMsgCode() {
    var phone = this.data.phone;
    var code = this.data.Code;
    var result = zhenzisms.client.validateCode(phone, code);
    var warn = null;
    if (result == 'ok') {
      warn = '验证正确';
    } else if (result == 'empty') {
      warn = '验证错误, 未生成验证码!';
    } else if (result == 'number_error') {
      warn = '验证错误，手机号不一致!';
    } else if (result == 'code_error') {
      warn = '验证错误，验证码不一致!';
    } else if (result == 'code_expired') {
      warn = '验证错误，验证码已过期!';
    }
    return warn;
  },

  /**
   * 验证图形验证码
   */
  validatePicCode() {
    var imgCode = this.data.CheckCode;
    var result = this.mcaptcha.validate(imgCode);
    var warn = null;
    if (this.data.CheckCode == '' || this.data.CheckCode == null) {
      warn = '请输入图形验证码';
    }
    if (!result) {
      warn = '图形验证码错误';
    } else {
      warn = '图形验证码正确'
    }
    return warn;
  },

  /**
   * 获得验证码按钮事件
   */
  doGetCode: function() {
    var that = this;

    var phone = that.data.phone;
    var imgCode = that.data.CheckCode;
    //判断手机号格式是否正确,图形验证码是否输入
    if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      that.buttonDisabled('手机号格式不对');
    } else if (imgCode == '' || imgCode == null) {
      that.buttonDisabled('请输入图形验证码');
    } else {
      that.setData({
        disabled: true
      })
      var data = {
        telephoneNumber: phone
      };
      //判断手机号是否已经被注册，已经被注册返回202，未被注册返回200
      utils.queryUserByPhone(data).then(res => {
        console.log(res);
        if (res.data.code == 202) {
          that.buttonDisabled('手机号已被注册');
        } else if (res.data.code == 200) {
          //使用事先申请的AppId、AppSecret初始化
          zhenzisms.client.init('https://sms_developer.zhenzikj.com', '102258', '0cb0c381-ef00-4da2-be01-df7ad8e763f9');
          zhenzisms.client.sendCode(function(res) {
            console.log(res.data);
            //当手机号正确的时候提示用户短信验证码已经发送
            that.showToastWindow('短信验证码已发送');
            //设置一分钟的倒计时
            that.data.interval = that.timer();
          }, phone, '验证码为:{code}', '1', 60 * 5, 6);
        } else {
          console.log('其他状态下的错误')
        }
      }, err => {
        console.log(err);
      })
    }
  },
  /**
   * 提示框函数
   */
  showToastWindow: function(title, icon = null, image = null) {
    wx.showToast({
      title: title,
      icon: icon,
      image: image,
      duration: 2000
    })
  },
  /**
   * 提示框+按钮不可用函数
   */
  buttonDisabled: function(title) {
    this.showToastWindow(title);
    this.setData({
      disabled: false
    })
    return;
  },
  /**
   * 设置一个60秒的定时器
   */
  timer: function() {
    var that = this;
    var currentTime = that.data.currentTime;
    return setInterval(function() {
      currentTime--; //每执行一次让倒计时秒数减一
      that.setData({
        text: '重新发送(' + currentTime + 's)', //按钮文字变成倒计时对应秒数
      })
      //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
      if (currentTime <= 0) {
        clearInterval(that.data.interval)
        that.setData({
          text: '获取验证码',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000);
  },

  /**
   * 注册提交事件
   */
  registerSubmit: function(e) {
    var that = this;
    //提交之前先判断图形验证码和短信验证码
    var picCodeWarn = that.validatePicCode();
    var msgCodeWarn = that.validateMsgCode();
    if (picCodeWarn != '图形验证码正确') {
      that.showToastWindow(picCodeWarn);
      return;
    } else if (msgCodeWarn != '验证正确') {
      that.showToastWindow(msgCodeWarn);
      return;
    } else if (that.data.NewChanges == '') {
      that.showToastWindow('请输入密码');
      return;
    } else if (that.data.NewChanges != that.data.NewChangesAgain) {
      that.showToastWindow('两次密码不一致');
      return;
    } else {
      var that = this;
      var phone = that.data.phone;
      var password = that.data.NewChanges;
      var data = {
        telephoneNumber: phone,
        password: password
      }
      utils.registerRequest(data).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          that.showToastWindow('注册成功');
          that.numSteps(); //步骤条数字加一
        }

      }, err => {
        console.log(err);
      })
    }
  },
  /**
   * 刷新图形验证码
   */
  onRefreshMcaptcha: function() {
    this.mcaptcha.refresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //创建一个Mcaptcha对象
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: 80,
      height: 35,
      createCodeImg: ""
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})