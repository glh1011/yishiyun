import utils from "../../../utils/util.js";

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
  },

  displayDiningRecord: function() {
    let requestData = {
      telephoneNumber: "13384996939",
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
      } else {
        this.setDefault();
      }
    }).catch(res => {
      this.setDefault();
      wx.showToast({
        title: "获取就餐记录失败",
        icon: 'none',
        duration: 2000
      })
      console.log("获取就餐记录失败");
    })
  },

  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hasDiningRecord: false,
      date: e.detail.value
    })
    this.displayDiningRecord();
  },

  setDefault() {
    this.setData({
      hasDiningRecord: false,
      breakfast: [],
      lunch: [],
      supper: []
    })
  }

})