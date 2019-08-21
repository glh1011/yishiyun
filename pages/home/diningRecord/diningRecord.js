import utils from "../../../utils/util.js";

Page({
  data: {
    today: '',
    date: "",
    breakfast: [],
    lunch: [],
    supper: []
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
          breakfast: responseData.breakfast,
          lunch: responseData.lunch,
          supper: responseData.dinner
        })
      } else if (res.data.code == 202) {
        this.setData({
          breakfast: [],
          lunch: [],
          supper: []
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      console.log("获取就餐记录失败");
    })
  },

  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.displayDiningRecord();
  }

})