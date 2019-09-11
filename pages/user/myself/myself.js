import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";

const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    monetarySum: 0,
    calorieSum: 0,
    icNumber: null,
  },

  attached: function (options) {
    this.setData({
      hasLogin: app.globalData.indexLoginStatus
    })
    if(this.data.hasLogin) {
      this.getData();
    }
  },

  methods: {
    getData: function () {
      utils.queryUser().then(res => {
        if (res.data.code === 200) {
          let responseData = res.data.data;
          this.setData({
            calorieSum: responseData.calorieSum,
            icNumber: responseData.icNumber,
            monetarySum: responseData.monetarySum,
            userName: responseData.userName
          })
        } else if (res.data.code === 202) {
          console.log("获取信息出错", res.data.msg);
        } else {
          console.log("获取信息失败", res);
          utils.showToastWindow('获取信息失败');
        }
      }).catch(res => {
        console.log("获取信息失败", res);
        utils.showToastWindow('获取信息失败');
      })
    },  
    logout: function() {
      utils.logout().then(res=>{
        if (res.data.code === 200){
          wx.removeStorageSync("token")
          wx.removeStorageSync("isFaceDetect");
          wx.showToast({
            title: "已退出，跳转中",
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }, 1000) //延迟时间
            },
          });
        } else {
          utils.showToastWindow("退出登录失败", "none");
        }
      }).catch(res=>{
        console.log("退出登录出错");
        utils.showToastWindow("退出登录失败", "none");
      })
    },
    showPrompt: function() {
      utils.showToastWindow("待升级", "none");
    }
  }
})