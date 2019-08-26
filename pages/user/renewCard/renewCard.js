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
        utils.showToastWindow(res.data.msg);
        this.getCurrentCard();
      } else {
        console.log("获取卡号出错", res);
        utils.showToastWindow(res.data.msg);
      }
    }).catch(res => {
      console.log("获取卡号失败", res);
      utils.showToastWindow("获取卡号失败");
    })
  }
})