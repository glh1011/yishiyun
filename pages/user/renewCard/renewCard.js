import utils from "../../../utils/util.js";
Page({
  data: {
    icNumber: null
  },
  onLoad: function (options) {
    this.getCurrentCard();
  },
  getCurrentCard: function(){
    utils.queryUser().then(res => {
      if (res.data.code === 200) {
        let responseData = res.data.data;
        this.setData({
          icNumber: responseData.icNumber,
        })
      } else {
        console.log("获取卡号失败", res);
      }
    }).catch(res => {
      console.log("获取卡号失败", res);
    })
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    utils.bindIcNumber(e.detail.value).then(res => {
      if (res.data.code === 200) {
        wx.showToast({
          title: res.data.msg,
        })
        this.getCurrentCard();
      } else {
        console.log("获取卡号失败", res);
        wx.showToast({
          title: res.data.msg,
        })
      }
    }).catch(res => {
      console.log("获取卡号失败", res);
    })
  }
})