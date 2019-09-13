import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";

const app = getApp()
const { $Toast } = require('../../../dist/base/index');

Page({
  data: {
    icNumber: "",
    userName: ""
  },

  onLoad: function(options) {
    auth.showLoginModal();
    this.getCurrentCard();
  },

  getCurrentCard: function() {
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

  formSubmit: function(e) {
    console.log(e.detail.value);
    // if(this.data.userName.length > 0 ) {
    let requestData = {
      icNumber: e.detail.value.icNumber,
      // userName: this.data.userName
    }
    utils.bindIcNumber(requestData).then(res => {
      console.log(res);
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
        $Toast({
          content: res.data.msg,
          type: 'error'
        });
      }
    }).catch(res => {
      console.log("更新卡号失败", res);
      $Toast({
        content: "更新卡号失败",
        type: 'error'
      });
    })
    // } else {
    //   utils.showToastWindow("真实姓名不能为空", "none")
    // } 
  },

  //真实姓名清除输入的空格
  // clearSpace: function(e) {
  //   this.setData({
  //     userName: e.detail.value.replace(/\s*/g, "")
  //   })
  //   console.log(this.data.userName.length);
  // }

  toastShow: function (str, icon) {
    var _this = this;
    _this.setData({
      isShow: true,
      txt: str,
      iconClass: icon
    });
    setTimeout(function () { //toast消失
      _this.setData({
        isShow: false
      });
    }, 1500);
  }
})