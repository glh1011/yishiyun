import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";


Page({
  data: {
    icNumber: "",
    userName: ""
  },

  onLoad: function (options) {
    auth.showLoginModal();
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
    // if(this.data.userName.length > 0 ) {
      let requestData = {
        icNumber: e.detail.value.icNumber,
        // userName: this.data.userName
      }
      utils.bindIcNumber(requestData).then(res => {
        if (res.data.code === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000) //延迟时间
            },
          });
        } else {
          console.log("更新卡号出错", res);
          utils.showToastWindow(res.data.msg);
        }
      }).catch(res => {
        console.log("更新卡号失败", res);
        utils.showToastWindow("更新卡号失败");
      })
    // } else {
    //   utils.showToastWindow("真实姓名不能为空", "none")
    // } 
  },

  //真实姓名清除输入的空格
  clearSpace: function (e) {
    this.setData({
      userName: e.detail.value.replace(/\s*/g, "")
    })
    console.log(this.data.userName.length);
  }
})