import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";

const { $Toast } = require('../../../dist/base/index');

Page({
  data: {
    today: '',
    date: "",
    breakfast: [],
    lunch: [],
    supper: [],
    hasDiningRecord: false,
  },

  onLoad: function (options) {
    var today = new Date();
    var d = utils.formatTime(today);
    this.setData({
      today: d,
      date: d
    });
    this.displayDiningRecord();

    auth.showLoginModal();
  },

  displayDiningRecord: function() {
    // wx.showLoading({ title: '加载中', icon: 'loading' });
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    let requestData = {
      date: this.data.date
    }
    utils.queryEatLog(requestData).then(res => {
      if (res.data.code == 200) {
        let responseData = res.data.data;
        this.setData({
          hasDiningRecord: true,
          breakfast: responseData.breakfast,
          lunch: responseData.lunch,
          supper: responseData.dinner
        })
      } else if(res.data.code == 202) {
        this.setDefault(res.data.msg);
        $Toast({
          content: res.data.msg,
          type: 'warning'
        });
      } else {
        this.setDefault("获取就餐记录失败");
        $Toast({
          content: "获取就餐记录失败",
          type: 'error'
        });
      }
      // wx.hideLoading();
    }).catch(res => {
      this.setDefault("获取就餐记录失败");
      $Toast({
        content: "获取就餐记录失败",
        type: 'error'
      });
      console.log("获取就餐记录失败");
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    this.displayDiningRecord();
  },

  setDefault(msg) {
    this.setData({
      hasDiningRecord: false,
      breakfast: [],
      lunch: [],
      supper: []
    })
    // utils.showToastWindow(msg, "none");
  }

})